import { Injectable } from '@nestjs/common';
import { BorrowedRepository } from '../repositories/borrowed.repository';

import { ResourceNotFound } from 'src/core/errors/resource-not-found';
import { ResourceAlreadyExists } from 'src/core/errors/resource-already-exists';
import { Either, left, right } from 'src/core/either';
import { Borrowed } from '../../enterprise/entities/borrowed';


export type unlinkBorrowedProductRequest = {
    id: string;
    backAt: Date;
    reasonBack: string;
};

type unlinkBorrowedProductResponse = Either<ResourceNotFound | ResourceAlreadyExists, Borrowed>;

@Injectable()
export class UnlinkBorrowedProductUseCase {
    constructor(private borrowedRepository: BorrowedRepository) {}

    async execute({ id, backAt, reasonBack }: unlinkBorrowedProductRequest): Promise<unlinkBorrowedProductResponse> {
        const borrowed = await this.borrowedRepository.findById(id);
        if (!borrowed) {
            return left(new ResourceNotFound('Borrowed'));
        }
        borrowed.backAt = backAt;
        borrowed.reasonBack = reasonBack;
        await this.borrowedRepository.unlinkBorrowed(id, backAt, reasonBack);
        return right(borrowed);
    }
}