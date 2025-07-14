import { Injectable, Inject } from '@nestjs/common';
import { IEmployeeQueryContract } from 'src/product/domain/application/contracts/employee-contract';
import { EmployeeRepository } from 'src/employee/domain/application/repositories/employee.repository';

@Injectable()
export class EmployeeQueryAdapter implements IEmployeeQueryContract {
  constructor(
    @Inject(EmployeeRepository)
    private readonly employeeRepository: EmployeeRepository,
  ) {}

  async findById(employeeId: string): Promise<any | null> {
    return this.employeeRepository.findById(employeeId);
  }
}
