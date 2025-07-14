import { Injectable, Inject } from '@nestjs/common';
import { Either, right, left } from 'src/core/either';
import { ResourceNotFound } from 'src/core/errors/resource-not-found';
import {
  EmployeeRepository,
  GetEmployeesFilter,
} from '../repositories/employee.repository';
import { Employee } from '../../enterprise/entities/employee';
import { PaginatedResponse } from 'src/core/repositories/paginated-response';
import { IProductQueryContract } from '../contracts/product-contract';

export type FetchEmployeesUseCaseRequest = GetEmployeesFilter;
export type FetchEmployeesUseCaseResponse = Either<
  ResourceNotFound,
  PaginatedResponse<Employee>
>;

@Injectable()
export class FetchEmployeesUseCase {
  constructor(
    private readonly employeeRepository: EmployeeRepository,
    @Inject('IProductQueryContract')
    private readonly productQuery: IProductQueryContract,
  ) {}

  async execute(
    filter?: FetchEmployeesUseCaseRequest,
  ): Promise<FetchEmployeesUseCaseResponse> {
    const employees = await this.employeeRepository.find(filter);
    if (!employees.data.length) {
      return left(new ResourceNotFound('Employee'));
    }

    await Promise.all(
      employees.data.map(async (employee) => {
        const produtos = await this.productQuery.findByEmployeeId(
          employee.id.toString(),
        );
        employee.produtos = produtos;
      }),
    );

    return right(employees);
  }
}
