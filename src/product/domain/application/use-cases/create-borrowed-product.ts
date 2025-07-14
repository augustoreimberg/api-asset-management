import { Injectable, Inject } from '@nestjs/common';
import { Either, left, right } from 'src/core/either';
import { ResourceAlreadyExists } from 'src/core/errors/resource-already-exists';
import { ResourceNotFound } from 'src/core/errors/resource-not-found';
import { IEmployeeQueryContract } from '../contracts/employee-contract';
import { BorrowedRepository } from 'src/product/domain/application/repositories/borrowed.repository';
import { Borrowed } from 'src/product/domain/enterprise/entities/borrowed';

interface CreateBorrowedProductRequest {
  productId: string;
  employeeId: string;
  saidAt: Date;
}

@Injectable()
export class CreateBorrowedProductUseCase {
  constructor(
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

    const productLinked = await this.borrowedRepository.findByProductId(productId);
    if (productLinked) {
      return left(new ResourceAlreadyExists('Borrowed'));
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
