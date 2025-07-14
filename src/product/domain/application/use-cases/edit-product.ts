import { Injectable } from '@nestjs/common';
import { ProductRepository } from '../repositories/product.respository';
import { ResourceNotFound } from 'src/core/errors/resource-not-found';
import { ResourceAlreadyExists } from 'src/core/errors/resource-already-exists';
import { Either, left, right } from 'src/core/either';
import { Product } from '../../enterprise/entities/product';

export type EditProductUseCaseRequest = {
    id: string;
    productType: string;
    productCode: string;
};

export type EditProductUseCaseResponse = Either<ResourceNotFound | ResourceAlreadyExists, Product>;

@Injectable()
export class EditProductUseCase {
    constructor(private productRepository: ProductRepository) {}

    async execute({
        id,
        productType,
        productCode,
    }: EditProductUseCaseRequest): Promise<EditProductUseCaseResponse> {
        const product = await this.productRepository.findById(id);

        if (!product) {
            return left(new ResourceNotFound('product'));
        }

        const productExists = await this.productRepository.findByTypeAndCode(productType, productCode);
        if (productExists) {
            return left(new ResourceAlreadyExists('product'));
        }

        product.productType = productType ?? product.productType
        product.productCode = productCode ?? product.productCode

        await this.productRepository.update(product);
        return right(product);
    }
}