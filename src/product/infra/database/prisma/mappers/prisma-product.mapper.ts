import { UniqueEntityID } from "src/core/entities/unique-entity-id";
import { Product } from "src/product/domain/enterprise/entities/product";
import { ProductType, Prisma, Product as PrismaProduct } from "@prisma/client";

export class PrismaProductMapper {
    static toDomain(raw: PrismaProduct): Product {
        return Product.create({
            name: raw.name,
            productType: raw.productType,
            productCode: raw.productCode,
            reasonDelete: raw.reasonDelete,
            createdAt: raw.createdAt,
            updatedAt: raw.updatedAt,
            deletedAt: raw.deletedAt,
        }, new UniqueEntityID(raw.id));
    }

    static toPrisma(product: Product): Prisma.ProductUncheckedCreateInput {
        return {
            id: product.id.toValue(),
            name: product.name,
            productType: product.productType as ProductType,
            productCode: product.productCode,
            reasonDelete: product.reasonDelete,
            createdAt: product.createdAt,
            updatedAt: product.updatedAt,
            deletedAt: product.deletedAt,
        };
    }
}