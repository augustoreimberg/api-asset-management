import { Injectable } from "@nestjs/common";
import { Either, left, right } from "src/core/either";
import { ResourceAlreadyExists } from "src/core/errors/resource-already-exists";
import { EmployeeRepository } from "../repositories/employee.repository";
import { Employee } from "../../enterprise/entities/employee";

export type DeleteEmployeeResponse = Either<ResourceAlreadyExists, Employee>;

@Injectable()
export class DeleteEmployeeUseCase {
    constructor(private employeeRepository: EmployeeRepository) {}

    async execute(id: string): Promise<DeleteEmployeeResponse> {
        const employee = await this.employeeRepository.findById(id);
        if (!employee) {
            return left(new ResourceAlreadyExists('Employee'));
        }
        if (employee.deletedAt !== null) {
            return left(new ResourceAlreadyExists('Employee'));
        }
        await this.employeeRepository.softDelete(id);
        return right(employee);
    }
}