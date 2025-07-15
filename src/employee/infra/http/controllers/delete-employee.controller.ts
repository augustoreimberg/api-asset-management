import {
  BadRequestException,
  Controller,
  Delete,
  MethodNotAllowedException,
  NotFoundException,
  Body,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';
import { z } from 'zod';
import { ZodValidationPipe } from '../pipes/zod-validation-pipe';
import { DeleteEmployeeUseCase } from 'src/employee/domain/application/use-cases/delete-employees';
import { ResourceNotFound } from 'src/core/errors/resource-not-found';
import { Public } from '../../auth/public';
import { deleteEmployeeMock } from 'test/mocks/employee/employee';
import { ResourceAlreadyExists } from 'src/core/errors/resource-already-exists';

export const deleteEmployeeQuerySchema = z.object({
  id: z.string().uuid(),
});
export type DeleteEmployeeQuery = z.infer<typeof deleteEmployeeQuerySchema>;

const bodyValidationPipe = new ZodValidationPipe(deleteEmployeeQuerySchema);

@ApiTags('employees')
@Controller('employees')
@Public()
export class DeleteEmployeeController {
  constructor(private deleteEmployeeUseCase: DeleteEmployeeUseCase) {}
  @Delete()
  @ApiOperation({ summary: 'Delete employee' })
  @ApiBody({
    description: 'Employee deletion payload',
    required: true,
    schema: { example: deleteEmployeeMock },
  })
  @ApiResponse({
    status: 200,
    description: 'Account with id:${id} deleted',
  })
  @ApiResponse({ status: 400, description: 'Validation or other error' })
  async handle(@Body(bodyValidationPipe) body: DeleteEmployeeQuery) {
    const response = await this.deleteEmployeeUseCase.execute(body.id);
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
    return { message: `Employee with id:${body.id} deleted` };
  }
}