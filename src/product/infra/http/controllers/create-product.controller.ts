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
import { CreateProductUseCase } from 'src/product/domain/application/use-cases/create-product';
import { ProductPresenter } from '../presenters/product.presenter';
import { ResourceAlreadyExists } from 'src/core/errors/resource-already-exists';
import { ResourceNotFound } from 'src/core/errors/resource-not-found';
import { Public } from '../../auth/public';
import { createProductMock } from 'test/mocks/product/product';
import { responseProductMock } from 'test/mocks/product/product';

export const createProductBodySchema = z.object({
  productType: z.enum(['NOTEBOOK', 'CHARGER', 'MONITOR', 'MOUSE', 'KEYBOARD', 'HEADPHONE']),
  productCode: z.string().min(2).max(255),
});
export type CreateProductRequest = z.infer<typeof createProductBodySchema>;
const bodyValidationPipe = new ZodValidationPipe(createProductBodySchema);

@ApiTags('Product')
@Controller('product')
@Public()
export class CreateProductController {
    constructor(private createProductUseCase: CreateProductUseCase) {}

    @Post()
    @ApiOperation({ summary: 'Create a new product' })
    @ApiBody({
        description: 'Account creation payload',
        required: true,
        schema: { example: createProductMock },
    })
    @ApiResponse({
        status: 201,
        description: 'Account created',
        schema: { example: responseProductMock },
    })
    @ApiResponse({ status: 400, description: 'Validation or other error' })

     async handle(@Body(bodyValidationPipe) body: CreateProductRequest) {
        const response = await this.createProductUseCase.execute(body);
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
        return ProductPresenter.toHTTP(response.value);
      }
}