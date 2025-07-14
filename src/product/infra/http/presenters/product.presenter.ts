import { Product } from 'src/product/domain/enterprise/entities/product';

export class ProductPresenter {
  static toHTTP(product: Product) {
    return {
      id: product.id.toString(),
      name: product.name,
      productType: product.productType,
      productCode: product.productCode,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
      deletedAt: product.deletedAt,
      reasonDelete: product.reasonDelete,
      available: (product as any).available,
    };
  }
}
