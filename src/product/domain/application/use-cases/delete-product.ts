import { Injectable } from "@nestjs/common";
import { Either, left, right } from "src/core/either";
import { ResourceAlreadyExists } from "src/core/errors/resource-already-exists";
import { ProductRepository } from "../repositories/product.respository";
import { Product } from "../../enterprise/entities/product";

export type DeleteProductResponse = Either<ResourceAlreadyExists, Product>

@Injectable()
export class DeleteProductUseCase {
    constructor(private productRepository: ProductRepository) {}

    async execute(id: string): Promise<DeleteProductResponse> {
        const product = await this.productRepository.findById(id);
        if (!product) {
            return left(new ResourceAlreadyExists('Product'));
        }
        await this.productRepository.softDelete(id);
        return right(product);
    }
}