import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { BorrowedRepository } from 'src/product/domain/application/repositories/borrowed.repository';
import { Borrowed } from 'src/product/domain/enterprise/entities/borrowed';
import { PrismaBorrowedMapper } from '../mappers/prisma-borrowed.mapper';
import { GetBorrowedFilter } from 'src/product/domain/application/repositories/borrowed.repository';


@Injectable()
export class PrismaBorrowedRepository implements BorrowedRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(borrowed: Borrowed): Promise<void> {
    const data = PrismaBorrowedMapper.toPrisma(borrowed);
    await this.prisma.productEmployee.create({ data });
  }

  async unlinkBorrowed(id: string, backAt: Date, reasonBack: string): Promise<void> {
    await this.prisma.productEmployee.update({
      where: { id },
      data: { backAt, reasonBack, deletedAt: new Date() },
    })
  }

  async find(filter?: GetBorrowedFilter): Promise<Borrowed[]> {
    const where: any = {};

    if (filter?.deleted === true) {
      where.deletedAt = { not: null };
    } else if (filter?.deleted === false || filter?.deleted === undefined) {
      where.deletedAt = null;
    }
    if (filter?.id) where.id = filter.id;
    if (filter?.employeeId) where.employeeId = filter.employeeId;
    if (filter?.productId) where.productId = filter.productId;
    if (filter?.saidAt) where.saidAt = filter.saidAt;
    if (filter?.backAt) where.backAt = filter.backAt;

    const borrowed = await this.prisma.productEmployee.findMany({ where });
    return borrowed.map(PrismaBorrowedMapper.toDomain);
  }

  async findById(id: string): Promise<Borrowed | null> {
    const borrowed = await this.prisma.productEmployee.findUnique({ where: { id } });
    return borrowed ? PrismaBorrowedMapper.toDomain(borrowed) : null;
  }

  async findByProductId(id: string): Promise<Borrowed | null> {
    const borrowed = await this.prisma.productEmployee.findFirst({ where: { productId: id, deletedAt: null } });
    return borrowed ? PrismaBorrowedMapper.toDomain(borrowed) : null;
  }
}
