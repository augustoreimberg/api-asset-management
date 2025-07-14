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
import { CreateBorrowedProductUseCase } from 'src/product/domain/application/use-cases/create-borrowed-product';
import { ResourceAlreadyExists } from 'src/core/errors/resource-already-exists';
import { ResourceNotFound } from 'src/core/errors/resource-not-found';
import { Public } from '../../auth/public';

export const createBorrowedBodySchema = z.object({
  productId: z.string().min(1),
  employeeId: z.string().min(1),
  saidAt: z.coerce.date(),
});
export type CreateBorrowedRequest = z.infer<typeof createBorrowedBodySchema>;
const bodyValidationPipe = new ZodValidationPipe(createBorrowedBodySchema);

@ApiTags('Borrowed')
@Controller('borrowed')
@Public()
export class CreateBorrowedController {
  constructor(
    private createBorrowedProductUseCase: CreateBorrowedProductUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new borrowed record' })
  @ApiBody({
    description: 'Borrowed creation payload',
    required: true,
    schema: {
      example: {
        productId: 'uuid-produto',
        employeeId: 'uuid-employee',
        saidAt: new Date().toISOString(),
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Borrowed created',
    schema: {
      example: {
        id: 'uuid-borrowed',
        productId: 'uuid-produto',
        employeeId: 'uuid-employee',
        saidAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Validation or other error' })
  async handle(@Body(bodyValidationPipe) body: CreateBorrowedRequest) {
    const response = await this.createBorrowedProductUseCase.execute(body);
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
    return response.value;
  }
}
