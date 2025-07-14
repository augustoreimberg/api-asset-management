import { UniqueEntityID } from "src/core/entities/unique-entity-id";
import { Product } from "src/product/domain/enterprise/entities/product";
import { ProductType, Prisma, Product as PrismaProduct } from "@prisma/client";

export class PrismaProductMapper {
    static toDomain(raw: PrismaProduct): Product {
        return Product.create({
            productType: raw.productType,
            productCode: raw.productCode,
            createdAt: raw.createdAt,
            updatedAt: raw.updatedAt,
            deletedAt: raw.deletedAt,
        }, new UniqueEntityID(raw.id));
    }

    static toPrisma(product: Product): Prisma.ProductUncheckedCreateInput {
        return {
            id: product.id.toValue(),
            productType: product.productType as ProductType,
            productCode: product.productCode,
            createdAt: product.createdAt,
            updatedAt: product.updatedAt,
            deletedAt: product.deletedAt,
        };
    }
}