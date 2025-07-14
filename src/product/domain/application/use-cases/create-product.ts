import { Injectable } from "@nestjs/common";
import { Either, left, right } from "src/core/either";
import { ResourceAlreadyExists } from "src/core/errors/resource-already-exists";
import { ProductRepository } from "src/product/domain/application/repositories/product.respository";
import { Product } from "src/product/domain/enterprise/entities/product";

export type CreateProductRequest = {
    name: string;
    productType: string;
    productCode: string;
};

type CreateProductResponse = Either<ResourceAlreadyExists, Product>;

@Injectable()
export class CreateProductUseCase {
    constructor(private productRepository: ProductRepository) {}

    async execute(
        data: CreateProductRequest
    ): Promise<CreateProductResponse>{
        if(
            data.productType !== 'NOTEBOOK' &&
            data.productType !== 'CHARGER' &&
            data.productType !== 'MONITOR' &&
            data.productType !== 'MOUSE' &&
            data.productType !== 'KEYBOARD' &&
            data.productType !== 'HEADPHONE'
        ){
            return left(new Error('Invalid product type'));
        }

        const productExists = await this.productRepository.findByCode(data.productCode);
        if(productExists) return left(new ResourceAlreadyExists('code'));
        const product = Product.create({
            ...data,
            name: data.name,
            productType: data.productType,
            productCode: data.productCode,
        })
        await this.productRepository.create(product);
        return right(product);
    }
}
