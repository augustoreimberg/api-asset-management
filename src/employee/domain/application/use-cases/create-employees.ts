import { Injectable } from "@nestjs/common";
import { Either, left, right } from "src/core/either";
import { ResourceAlreadyExists } from "src/core/errors/resource-already-exists";
import { EmployeeRepository } from "../repositories/employee.repository";
import { Employee } from "../../enterprise/entities/employee";

export type CreateEmployeeRequest = {
    name: string;
    email: string;
    filial: string;
    nationality: string;
    maritalStatus: string;
    birthDate: Date;
    cpf: string;
    rg: string;
    address: string;
    houseNumber: string;
    neighborhood: string;
    city: string;
    state: string;
    cep: string;
};

type CreateEmployeeResponse = Either<ResourceAlreadyExists, Employee>;

@Injectable()
export class CreateEmployeeUseCase {
    constructor(private employeeRepository: EmployeeRepository) {}

    async execute(
        data: CreateEmployeeRequest
    ): Promise<CreateEmployeeResponse> {

        if (
            data.filial !== 'MATRIZ' &&
            data.filial !== 'RJ' &&
            data.filial !== 'ALPHAVILLE' &&
            data.filial !== 'PINDA'
        ) {
            return left(new Error("Invalid filial"));
        }

        const employee = Employee.create({
            ...data,
            name: data.name,
            email: data.email,
            filial: data.filial,
            nationality: data.nationality,
            maritalStatus: data.maritalStatus,
            birthDate: data.birthDate,
            cpf: data.cpf,
            rg: data.rg,
            address: data.address,
            houseNumber: data.houseNumber,
            neighborhood: data.neighborhood,
            city: data.city,
            state: data.state,
            cep: data.cep,
        })

        await this.employeeRepository.create(employee);
        return right(employee);
    }
}