import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import {
  ProductRepository,
  GetProductsFilter,
} from 'src/product/domain/application/repositories/product.respository';
import { Product } from 'src/product/domain/enterprise/entities/product';
import { PrismaProductMapper } from '../mappers/prisma-product.mapper';
import { PaginatedResponse } from 'src/core/repositories/paginated-response';
import { ProductType } from '@prisma/client';

@Injectable()
export class PrismaProductRepository implements ProductRepository {
  constructor(private prisma: PrismaService) {}

  async create(product: Product): Promise<void> {
    const raw = PrismaProductMapper.toPrisma(product);
    await this.prisma.product.create({ data: raw });
  }

  async update(product: Product): Promise<void> {
    const raw = PrismaProductMapper.toPrisma(product);
    await this.prisma.product.update({
      where: { id: product.id.toValue() },
      data: raw,
    });
  }

  async findById(id: string): Promise<Product | null> {
    const product = await this.prisma.product.findUnique({
      where: { id, deletedAt: null },
    });
    if (!product) {
      return null;
    }
    return PrismaProductMapper.toDomain(product);
  }

  async findByTypeAndCode(
    type: ProductType,
    code: string,
  ): Promise<Product | null> {
    const product = await this.prisma.product.findFirst({
      where: { productType: type, productCode: code, deletedAt: null },
    });
    if (!product) {
      return null;
    }
    return PrismaProductMapper.toDomain(product);
  }

  async find(filter?: GetProductsFilter): Promise<PaginatedResponse<Product>> {
    const page = filter?.page ?? 1;
    const perPage = 20;

    const where: any = { deletedAt: null };
    if (filter?.id) where.id = filter.id;
    if (filter?.productType) where.productType = filter.productType;
    if (filter?.productCode) where.productCode = filter.productCode;

    const [total, product] = await Promise.all([
      this.prisma.product.count({ where }),
      this.prisma.product.findMany({
        where,
        skip: (page - 1) * perPage,
        take: perPage,
      }),
    ]);

    const lastPage = Math.ceil(total / perPage);
    const hasMore = page < lastPage;

    return {
      data: product.map(PrismaProductMapper.toDomain),
      total,
      page,
      lastPage,
      hasMore,
    };
  }
  async softDelete(id: string): Promise<void> {
    await this.prisma.softDelete('product', { id: id });
  }

  async findByEmployeeId(employeeId: string): Promise<any[]> {
    const productEmployees = await this.prisma.productEmployee.findMany({
      where: { employeeId, deletedAt: null },
      include: { product: true },
    });
    return productEmployees.map((pe) => ({
      ...pe,
      product: pe.product,
    }));
  }
}
