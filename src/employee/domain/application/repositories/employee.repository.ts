import { PaginationParams } from 'src/core/repositories/pagination-params';
import { Employee } from '../../enterprise/entities/employee';
import { PaginatedResponse } from 'src/core/repositories/paginated-response';

export type GetEmployeesFilter = {
  id?: string;
  email?: string;
  name?: string;
} & PaginationParams;

export abstract class EmployeeRepository {
  abstract create(employee: Employee): Promise<void>;
  abstract update(employee: Employee): Promise<void>;
  abstract findById(id: string): Promise<Employee | null>;
  abstract findByEmail(email: string): Promise<Employee | null>;
  abstract findByCpf(cpf: string): Promise<Employee | null>;
  abstract findByRg(rg: string): Promise<Employee | null>;
  abstract find(
    filter?: GetEmployeesFilter,
  ): Promise<PaginatedResponse<Employee>>;
  abstract softDelete(id: string): Promise<void>;
}
