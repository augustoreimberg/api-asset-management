import { Injectable } from '@nestjs/common';
import { EmployeeRepository } from '../repositories/employee.repository';
import { ResourceNotFound } from 'src/core/errors/resource-not-found';
import { ResourceAlreadyExists } from 'src/core/errors/resource-already-exists';
import { Either, left, right } from 'src/core/either';
import { Employee } from '../../enterprise/entities/employee';

export type EditEmployeeUseCaseRequest = {
  id: string;
  name?: string;
  email?: string;
  filial?: string;
  nationality?: string;
  maritalStatus?: string;
  birthDate?: Date;
  cpf?: string;
  rg?: string;
  address?: string;
  houseNumber?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  cep?: string;
};

export type EditEmployeeUseCaseResponse = Either<
  ResourceNotFound | ResourceAlreadyExists,
  Employee
>;

@Injectable()
export class EditEmployeeUseCase {
  constructor(private employeeRepository: EmployeeRepository) {}

  async execute({
    id,
    name,
    email,
    filial,
    nationality,
    maritalStatus,
    birthDate,
    cpf,
    rg,
    address,
    houseNumber,
    neighborhood,
    city,
    state,
    cep,
  }: EditEmployeeUseCaseRequest): Promise<EditEmployeeUseCaseResponse> {
    const employee = await this.employeeRepository.findById(id);
    if (!employee) {
      return left(new ResourceNotFound('Employee'));
    }

    if (email) {
      const emailExists = await this.employeeRepository.findByEmail(email);
      if (emailExists && emailExists.id.toString() !== id) {
        return left(new ResourceAlreadyExists('email'));
      }
    }

    if (cpf) {
      const cpfExists = await this.employeeRepository.findByCpf(cpf);
      if (cpfExists && cpfExists.id.toString() !== id) {
        return left(new ResourceAlreadyExists('cpf'));
      }
    }

    if (rg) {
      const rgExists = await this.employeeRepository.findByRg(rg);
      if (rgExists && rgExists.id.toString() !== id) {
        return left(new ResourceAlreadyExists('rg'));
      }
    }

    employee.name = name ?? employee.name;
    employee.email = email ?? employee.email;
    employee.filial = filial ?? employee.filial;
    employee.nationality = nationality ?? employee.nationality;
    employee.maritalStatus = maritalStatus ?? employee.maritalStatus;
    employee.birthDate = birthDate ?? employee.birthDate;
    employee.cpf = cpf ?? employee.cpf;
    employee.rg = rg ?? employee.rg;
    employee.address = address ?? employee.address;
    employee.houseNumber = houseNumber ?? employee.houseNumber;
    employee.neighborhood = neighborhood ?? employee.neighborhood;
    employee.city = city ?? employee.city;
    employee.state = state ?? employee.state;
    employee.cep = cep ?? employee.cep;

    await this.employeeRepository.update(employee);
    return right(employee);
  }
}
