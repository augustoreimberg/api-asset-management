import { UniqueEntityID } from 'src/core/entities/unique-entity-id';
import { Borrowed } from 'src/product/domain/enterprise/entities/borrowed';
import { ProductEmployee as PrismaBorrowed } from '@prisma/client';

export class PrismaBorrowedMapper {
  static toDomain(raw: PrismaBorrowed): Borrowed {
    return Borrowed.create(
      {
        productId: raw.productId,
        employeeId: raw.employeeId,
        saidAt: raw.saidAt,
        backAt: raw.backAt,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt ?? new Date(),
        deletedAt: raw.deletedAt,
        reasonBack: raw.reasonBack,
      },
      new UniqueEntityID(raw.id),
    );
  }

  static toPrisma(borrowed: Borrowed): any {
    return {
      id: borrowed.id.toValue(),
      employee: { connect: { id: borrowed.employeeId } },
      product: { connect: { id: borrowed.productId } },
      saidAt: borrowed.saidAt,
      backAt: borrowed.backAt,
      createdAt: borrowed.createdAt,
      updatedAt: borrowed.updatedAt ?? new Date(),
      deletedAt: borrowed.deletedAt,
      reasonBack: borrowed.reasonBack,
    };
  }
}
