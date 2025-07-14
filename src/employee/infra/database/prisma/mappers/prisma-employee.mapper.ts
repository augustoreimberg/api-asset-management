import { UniqueEntityID } from 'src/core/entities/unique-entity-id';
import { Employee } from 'src/employee/domain/enterprise/entities/employee';
import { Filial, Prisma, Employee as PrismaEmployee } from '@prisma/client';
import { Product } from 'src/product/domain/enterprise/entities/product';

export class PrismaEmployeeMapper {
  static toDomain(raw: any): Employee {
    return Employee.create(
      {
        name: raw.name,
        email: raw.email,
        rg: raw.rg,
        cpf: raw.cpf,
        city: raw.city,
        state: raw.state,
        filial: raw.filial as Filial,
        birthDate: raw.birthDate,
        address: raw.address,
        houseNumber: raw.houseNumber,
        neighborhood: raw.neighborhood,
        cep: raw.cep,
        nationality: raw.nationality,
        maritalStatus: raw.maritalStatus,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
        deletedAt: raw.deletedAt,
        produtos: raw.produtos ?? [], // Mapeia os produtos
      },
      new UniqueEntityID(raw.id),
    );
  }

  static toPrisma(employee: Employee): Prisma.EmployeeUncheckedCreateInput {
    return {
      id: employee.id.toValue(),
      name: employee.name,
      email: employee.email,
      rg: employee.rg,
      cpf: employee.cpf,
      city: employee.city,
      state: employee.state,
      filial: employee.filial as Filial,
      birthDate: employee.birthDate,
      address: employee.address,
      houseNumber: employee.houseNumber,
      neighborhood: employee.neighborhood,
      cep: employee.cep,
      nationality: employee.nationality,
      maritalStatus: employee.maritalStatus,
      createdAt: employee.createdAt,
      updatedAt: employee.updatedAt,
      deletedAt: employee.deletedAt,
    };
  }
}
