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
import { EditProductUseCase } from 'src/product/domain/application/use-cases/edit-product';
import { ProductPresenter } from '../presenters/product.presenter';
import { ResourceNotFound } from 'src/core/errors/resource-not-found';
import { Public } from '../../auth/public';
import { responseProductMock } from 'test/mocks/product/product';
import { editProductMock } from 'test/mocks/product/product';

export const editProductBodySchema = z.object({
    id: z.string().uuid(),
    name: z.string().min(2).max(255),
    productType: z.enum(['NOTEBOOK', 'CHARGER', 'MONITOR', 'MOUSE', 'KEYBOARD', 'HEADPHONE']),
    productCode: z.string().min(2).max(255),
});
export type editProductBodySchemaType = z.infer<typeof editProductBodySchema>;

const bodyValidationPipe = new ZodValidationPipe(editProductBodySchema);

@ApiTags('Product')
@Controller('product')
@Public()
export class EditProductController {
  constructor(private editProductUseCase: EditProductUseCase) {}

  @Put()
   @ApiOperation({ summary: 'Edit product' })
     @ApiBody({
      description: 'product edit payload',
      required: true,
      schema: { example: editProductMock},
    })
    @ApiResponse({
      status: 201,
      description: 'product edited',
      schema: { example: responseProductMock },
    })
    @ApiResponse({ status: 404, description: 'product not found' })
    @ApiResponse({ status: 400, description: 'Bad request' })
    async handle(@Body(bodyValidationPipe) body: editProductBodySchemaType) {
      const { id: productId, ...data} = body;
      const cleanBody = {
          ...data,
          name: data.name ?? undefined,
          productType: data.productType ?? undefined,
          productCode: data.productCode ?? undefined,
      };
      const response = await this.editProductUseCase.execute({
          id: productId,
          ...cleanBody
      })
      if (response.isLeft()) {
        const error = response.value;
        if (error instanceof ResourceNotFound) {
          throw new NotFoundException(error.message);
        }
        throw new BadRequestException(error.message);
      }
      return ProductPresenter.toHTTP(response.value);
    }
}