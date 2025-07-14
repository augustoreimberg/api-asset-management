import {
  BadRequestException,
  Body,
  Controller,
  NotFoundException,
  MethodNotAllowedException,
  Post,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { z } from 'zod';
import { ZodValidationPipe } from '../pipes/zod-validation-pipe';
import { CreateEmployeeUseCase } from 'src/employee/domain/application/use-cases/create-employees';
import { EmployeePresenter } from '../presenters/employee.presenter';
import { ResourceAlreadyExists } from 'src/core/errors/resource-already-exists';
import { ResourceNotFound } from 'src/core/errors/resource-not-found';
import { Public } from '../../auth/public';
import { employeeResponseMock } from 'test/mocks/employee/employee';
import { createEmployeeMock } from 'test/mocks/employee/employee';

export const createEmployeeBodySchema = z.object({
  name: z.string().min(3).max(255),
  email: z.string().email(),
  filial: z.enum(['MATRIZ', 'RJ', 'ALPHAVILLE', 'PINDA']),
  nationality: z.string().min(3).max(255),
  maritalStatus: z.string().min(3).max(255),
  birthDate: z.coerce.date(),
  cpf: z.string().min(3).max(255),
  rg: z.string().min(3).max(255),
  address: z.string().min(3).max(255),
  houseNumber: z.string().min(2).max(255),
  neighborhood: z.string().min(3).max(255),
  city: z.string().min(3).max(255),
  state: z.string().min(2).max(255),
  cep: z.string().min(3).max(255),
})
export type CreateEmployeeBodySchema = z.infer<typeof createEmployeeBodySchema>;
const bodyValidationPipe = new ZodValidationPipe(createEmployeeBodySchema);

@ApiTags('employees')
@Controller('employees')
@Public()
export class CreateEmployeeController {
  constructor(private createEmployeeUseCase: CreateEmployeeUseCase) {}

  @Post()
  @ApiOperation({ summary: 'Create a new account' })
  @ApiBody({
    description: 'Account creation payload',
    required: true,
    schema: { example: createEmployeeMock },
  })
  @ApiResponse({
    status: 201,
    description: 'Account created',
    schema: { example: employeeResponseMock },
  })
  @ApiResponse({ status: 400, description: 'Validation or other error' })

  async handle(@Body(bodyValidationPipe) body: CreateEmployeeBodySchema){
    const response = await this.createEmployeeUseCase.execute(body);
    if (response.isLeft()) {
      const error = response.value;
      switch (error.constructor) {
        case ResourceNotFound:
          throw new NotFoundException(error.message);
        case ResourceAlreadyExists:
          throw new MethodNotAllowedException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }
    return EmployeePresenter.toHTTP(response.value);
  }
}