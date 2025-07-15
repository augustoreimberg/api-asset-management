import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import {
  EmployeeRepository,
  GetEmployeesFilter,
} from 'src/employee/domain/application/repositories/employee.repository';
import { Employee } from 'src/employee/domain/enterprise/entities/employee';
import { PrismaEmployeeMapper } from '../mappers/prisma-employee.mapper';
import { PaginatedResponse } from 'src/core/repositories/paginated-response';

@Injectable()
export class PrismaEmployeeRepository implements EmployeeRepository {
  constructor(private prisma: PrismaService) {}

  async create(employee: Employee): Promise<void> {
    const raw = PrismaEmployeeMapper.toPrisma(employee);
    await this.prisma.employee.create({ data: raw });
  }

  async update(employee: Employee): Promise<void> {
    await this.prisma.employee.update({
      where: {
        id: employee.id.toString(),
      },
      data: PrismaEmployeeMapper.toPrisma(employee),
    });
  }

  async findById(id: string): Promise<Employee | null> {
    const employee = await this.prisma.employee.findUnique({
      where: {
        id,
        deletedAt: null,
      },
    });

    if (!employee) {
      return null;
    }

    return PrismaEmployeeMapper.toDomain(employee);
  }

  async findByEmail(email: string): Promise<Employee | null> {
    const employee = await this.prisma.employee.findUnique({
      where: {
        email,
        deletedAt: null,
      },
    });

    if (!employee) {
      return null;
    }

    return PrismaEmployeeMapper.toDomain(employee);
  }

  async findByCpf(cpf: string): Promise<Employee | null> {
    const employee = await this.prisma.employee.findUnique({
      where: {
        cpf,
        deletedAt: null,
      },
    });

    if (!employee) {
      return null;
    }

    return PrismaEmployeeMapper.toDomain(employee);
  }

  async findByRg(rg: string): Promise<Employee | null> {
    const employee = await this.prisma.employee.findFirst({
      where: {
        rg,
        deletedAt: null,
      },
    });

    if (!employee) {
      return null;
    }

    return PrismaEmployeeMapper.toDomain(employee);
  }

  async find(
    filter?: GetEmployeesFilter,
  ): Promise<PaginatedResponse<Employee>> {
    const page = filter?.page ?? 1;
    const perPage = 20;

    const where: any = { deletedAt: null };
    if (filter?.id) where.id = filter.id;
    if (filter?.email) where.email = filter.email;
    if (filter?.name)
      where.name = { contains: filter.name, mode: 'insensitive' };
    if (filter?.search) {
      where.OR = [
        { name: { contains: filter.search, mode: 'insensitive' } },
        { email: { contains: filter.search, mode: 'insensitive' } },
      ];
    }

    const [total, employees] = await Promise.all([
      this.prisma.employee.count({ where }),
      this.prisma.employee.findMany({
        where,
        skip: (page - 1) * perPage,
        take: perPage,
        include: { produtos: true },
      }),
    ]);

    const lastPage = Math.ceil(total / perPage);
    const hasMore = page < lastPage;

    return {
      data: employees.map(PrismaEmployeeMapper.toDomain),
      total,
      page,
      lastPage,
      hasMore,
    };
  }

  async softDelete(id: string): Promise<void> {
    await this.prisma.softDelete('employee', { id: id });
  }
}
