import {
  BadRequestException,
  Controller,
  Get,
  NotFoundException,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { z } from 'zod';
import { ZodValidationPipe } from '../pipes/zod-validation-pipe';
import { FetchEmployeesUseCase } from 'src/employee/domain/application/use-cases/fetch-employees';
import { EmployeePresenter } from '../presenters/employee.presenter';
import { ResourceNotFound } from 'src/core/errors/resource-not-found';
import { Public } from '../../auth/public';
import { employeeResponseMock } from 'test/mocks/employee/employee';

export const fetchEmployeesQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  search: z.string().optional(),
  id: z.string().optional(),
  email: z.string().optional(),
  name: z.string().optional(),
});
export type FetchEmployeesQuerySchema = z.infer<typeof fetchEmployeesQuerySchema>;
const queryValidationPipe = new ZodValidationPipe(fetchEmployeesQuerySchema);

@ApiTags('employees')
@Controller('employees')
@Public()
export class FetchEmployeeController {
  constructor(private fetchEmployeesUseCase: FetchEmployeesUseCase) {}

  @Get()
  @ApiOperation({ summary: 'List employees with pagination and filters' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'search', required: false, type: String, example: 'Jhon' })
  @ApiQuery({ name: 'id', required: false, type: String })
  @ApiQuery({ name: 'email', required: false, type: String })
  @ApiQuery({ name: 'name', required: false, type: String })
  @ApiResponse({
    status: 200,
    description: 'Paginated list of employees',
    schema: {
      example: {
        data: [employeeResponseMock],
        total: 1,
        page: 1,
        lastPage: 1,
        hasMore: false,
      },
    },
  })
  @ApiResponse({ status: 404, description: 'No employees found' })
  @ApiResponse({ status: 400, description: 'Validation or other error' })
  async handle(@Query(queryValidationPipe) query: FetchEmployeesQuerySchema) {
    const response = await this.fetchEmployeesUseCase.execute(query);
    if (response.isLeft()) {
      const error = response.value;
      if (error instanceof ResourceNotFound) {
        throw new NotFoundException(error.message);
      }
      throw new BadRequestException(error);
    }
    return {
      ...response.value,
      data: response.value.data.map(EmployeePresenter.toHTTP),
    };
  }
}