import { Product } from 'src/product/domain/enterprise/entities/product';

export class ProductPresenter {
  static toHTTP(product: any) {
    return {
      id: product.id?.toString?.() ?? product.id,
      name: product.name,
      productType: product.productType,
      productCode: product.productCode,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
      deletedAt: product.deletedAt,
      reasonDelete: product.reasonDelete,
      available: product.available,
      borrowed_id: product.borrowed_id ?? undefined,
    };
  }
}
