import { Injectable, Inject } from '@nestjs/common';
import { Either, left, right } from 'src/core/either';
import { ResourceAlreadyExists } from 'src/core/errors/resource-already-exists';
import { ResourceNotFound } from 'src/core/errors/resource-not-found';
import { ProductRepository } from 'src/product/domain/application/repositories/product.respository';
import { IEmployeeQueryContract } from '../contracts/employee-contract';
import { BorrowedRepository } from 'src/product/domain/application/repositories/borrowed.repository';
import { Product } from 'src/product/domain/enterprise/entities/product';
import { Borrowed } from 'src/product/domain/enterprise/entities/borrowed';

interface CreateBorrowedProductRequest {
  productId: string;
  employeeId: string;
  saidAt: Date;
}

@Injectable()
export class CreateBorrowedProductUseCase {
  constructor(
    private readonly productRepository: ProductRepository,
    @Inject('IEmployeeQueryContract')
    private readonly employeeQuery: IEmployeeQueryContract,
    private readonly borrowedRepository: BorrowedRepository,
  ) {}

  async execute({
    productId,
    employeeId,
    saidAt,
  }: CreateBorrowedProductRequest): Promise<Either<Error, Borrowed>> {
    const employee = await this.employeeQuery.findById(employeeId);
    if (!employee) {
      return left(new ResourceNotFound('Employee'));
    }

    const borrowedList =
      await this.productRepository.findProductBorrowedById(productId);
    const isBorrowed = borrowedList.some((b) => !b.backAt && !b.deletedAt);
    if (isBorrowed) {
      return left(new ResourceAlreadyExists('Product is already borrowed'));
    }

    const borrowed = Borrowed.create({
      productId,
      employeeId,
      saidAt,
    });
    await this.borrowedRepository.create(borrowed);
    return right(borrowed);
  }
}
