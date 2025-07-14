import { Injectable } from "@nestjs/common";
import { Either, right, left } from "src/core/either";
import { ResourceNotFound } from "src/core/errors/resource-not-found";
import { ProductRepository, GetProductsFilter } from "../repositories/product.respository";
import { Product } from "../../enterprise/entities/product";
import { PaginatedResponse } from "src/core/repositories/paginated-response";

export type fetchProductsUseCaseRequest = GetProductsFilter;
export type fetchProductsUseCaseResponse = Either<ResourceNotFound, PaginatedResponse<Product>>;

@Injectable ()
export class FetchProductsUseCase {
    constructor(private readonly productRepository: ProductRepository) {}
    
    async execute(filter?: fetchProductsUseCaseRequest): Promise<fetchProductsUseCaseResponse> {
        const products = await this.productRepository.find(filter);
        if (!products.data.length) {
            return left(new ResourceNotFound('Product'));
        }
        
        return right(products);
    }
}