import {
  BadRequestException,
  Controller,
  Put,
  NotFoundException,
  Body,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';
import { z } from 'zod';
import { ZodValidationPipe } from '../pipes/zod-validation-pipe';
import { EditEmployeeUseCase } from 'src/employee/domain/application/use-cases/edit-employee';
import { EmployeePresenter } from '../presenters/employee.presenter';
import { ResourceNotFound } from 'src/core/errors/resource-not-found';
import { Public } from '../../auth/public';
import { employeeResponseMock } from 'test/mocks/employee/employee';
import { editEmployeeMock } from 'test/mocks/employee/employee';

export const editEmployeeQuerySchema = z.object({
  id: z.string().uuid(),
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
  state: z.string().min(2).max(2),
  cep: z.string().min(8).max(8),
})
export type editAccountBodySchema = z.infer<typeof editEmployeeQuerySchema>

const bodyValidationPipe = new ZodValidationPipe(editEmployeeQuerySchema);

@ApiTags('employees')
@Controller('employees')
@Public()
export class EditEmployeeController {
  constructor(private editEmployeeUseCase: EditEmployeeUseCase) {}

  @Put('edit')
  @ApiOperation({ summary: 'Edit employee' })
   @ApiBody({
    description: 'Account creation payload',
    required: true,
    schema: { example: editEmployeeMock},
  })
  @ApiResponse({
    status: 201,
    description: 'Account created',
    schema: { example: employeeResponseMock },
  })
  @ApiResponse({ status: 404, description: 'Account not found' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async handle(@Body(bodyValidationPipe) body: editAccountBodySchema) {
    const { id: employeeId, ...data} = body;
    const cleanBody = {
        ...data,
        name: data.name ?? undefined,
        email: data.email ?? undefined,
        filial: data.filial ?? undefined,
        nationality: data.nationality ?? undefined,
        maritalStatus: data.maritalStatus ?? undefined,
        birthDate: data.birthDate ?? undefined,
        cpf: data.cpf ?? undefined,
        rg: data.rg ?? undefined,
        address: data.address ?? undefined,
        houseNumber: data.houseNumber ?? undefined,
        neighborhood: data.neighborhood ?? undefined,
        city: data.city ?? undefined,
        state: data.state ?? undefined,
        cep: data.cep ?? undefined,
    };
    const response = await this.editEmployeeUseCase.execute({
        id: employeeId,
        ...cleanBody
    })
    if (response.isLeft()) {
      const error = response.value;
      if (error instanceof ResourceNotFound) {
        throw new NotFoundException(error.message);
      }
      throw new BadRequestException(error);
    }
    return EmployeePresenter.toHTTP(response.value);
  }
}
