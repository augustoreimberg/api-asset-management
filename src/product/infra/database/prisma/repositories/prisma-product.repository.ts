import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import {
  ProductRepository,
  GetProductsFilter,
} from 'src/product/domain/application/repositories/product.respository';
import { Product } from 'src/product/domain/enterprise/entities/product';
import { Borrowed } from 'src/product/domain/enterprise/entities/borrowed';
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

  async createBorrowed(Borrowed): Promise<void> {
    await this.prisma.productEmployee.create({
      data: Borrowed,
    });
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

    const where: any = {};

    if (filter?.deleted === true) {
      where.deletedAt = { not: null };
    } else if (filter?.deleted === false || filter?.deleted === undefined) {
      where.deletedAt = null;
    }
    if (filter?.productType) where.productType = filter.productType;
    if (filter?.productCode) where.productCode = filter.productCode;
    if (filter?.name)
      where.name = { contains: filter.name, mode: 'insensitive' };
    if (filter?.search) {
      where.OR = [
        { name: { contains: filter.search, mode: 'insensitive' } },
        { productCode: { contains: filter.search, mode: 'insensitive' } },
      ];
    }

    const [total, products] = await Promise.all([
      this.prisma.product.count({ where }),
      this.prisma.product.findMany({
        where,
        skip: (page - 1) * perPage,
        take: perPage,
      }),
    ]);

    const productIds = products.map((p) => p.id);
    const borrowed = await this.prisma.productEmployee.findMany({
      where: {
        productId: { in: productIds },
        backAt: null,
        deletedAt: null,
      },
      select: { productId: true },
    });
    const borrowedIds = new Set(borrowed.map((b) => b.productId));

    const lastPage = Math.ceil(total / perPage);
    const hasMore = page < lastPage;

    return {
      data: products.map((raw) => {
        const domain = PrismaProductMapper.toDomain(raw);
        domain.available = !borrowedIds.has(raw.id);
        return domain;
      }),
      total,
      page,
      lastPage,
      hasMore,
    };
  }
  async softDelete(id: string, reasonDelete: string): Promise<void> {
    await this.prisma.softDelete('product', { id: id }, reasonDelete);
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

  async findProductBorrowedById(id: string): Promise<any[]> {
    const productBorrowed = await this.prisma.productEmployee.findMany({
      where: { productId: id, deletedAt: null },
      include: { product: true },
    });
    return productBorrowed.map((pb) => ({
      ...pb,
      product: pb.product,
    }));
  }
}
