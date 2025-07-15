import { Injectable } from "@nestjs/common";
import { Either, right, left } from "src/core/either";
import { ResourceNotFound } from "src/core/errors/resource-not-found";
import { BorrowedRepository, GetBorrowedFilter } from "../repositories/borrowed.repository";
import { Borrowed } from "../../enterprise/entities/borrowed";

export type fetchBorrowedUseCaseRequest = GetBorrowedFilter;
export type fetchBorrowedUseCaseResponse = Either<ResourceNotFound, Borrowed[]>;

@Injectable()
export class FetchBorrowedProductsUseCase {
    constructor(private borrowedRepository: BorrowedRepository) {}    
    async execute(filter?: GetBorrowedFilter): Promise<fetchBorrowedUseCaseResponse> {
        const borrowed = await this.borrowedRepository.find(filter);
        if (!borrowed.length) {
            return left(new ResourceNotFound('Borrowed'));
        }
        return right(borrowed);
    }
}