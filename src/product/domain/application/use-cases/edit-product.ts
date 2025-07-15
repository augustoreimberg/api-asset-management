import { Injectable } from '@nestjs/common';
import { ProductRepository } from '../repositories/product.respository';
import { ResourceNotFound } from 'src/core/errors/resource-not-found';
import { ResourceAlreadyExists } from 'src/core/errors/resource-already-exists';
import { Either, left, right } from 'src/core/either';
import { Product } from '../../enterprise/entities/product';

export type EditProductUseCaseRequest = {
  id: string;
  name?: string;
  productType?: string;
  productCode?: string;
};

export type EditProductUseCaseResponse = Either<
  ResourceNotFound | ResourceAlreadyExists,
  Product
>;

@Injectable()
export class EditProductUseCase {
  constructor(private productRepository: ProductRepository) {}

  async execute({
    id,
    name,
    productType,
    productCode,
  }: EditProductUseCaseRequest): Promise<EditProductUseCaseResponse> {
    const product = await this.productRepository.findById(id);

    if (!product) {
      return left(new ResourceNotFound('product'));
    }

    if (productCode !== undefined) {
      const productExists =
        await this.productRepository.findByCode(productCode);
      if (productExists && productExists.id.toString() !== id) {
        return left(new ResourceAlreadyExists('product'));
      }
    }

    if (name !== undefined) product.name = name;
    if (productType !== undefined) product.productType = productType;
    if (productCode !== undefined) product.productCode = productCode;

    await this.productRepository.update(product);
    return right(product);
  }
}
