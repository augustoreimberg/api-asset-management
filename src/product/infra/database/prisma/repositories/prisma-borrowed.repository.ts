import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { BorrowedRepository } from 'src/product/domain/application/repositories/borrowed.repository';
import { Borrowed } from 'src/product/domain/enterprise/entities/borrowed';
import { PrismaBorrowedMapper } from '../mappers/prisma-borrowed.mapper';

@Injectable()
export class PrismaBorrowedRepository implements BorrowedRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(borrowed: Borrowed): Promise<void> {
    const data = PrismaBorrowedMapper.toPrisma(borrowed);
    await this.prisma.productEmployee.create({ data });
  }
}
