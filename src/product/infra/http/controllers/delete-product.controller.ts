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
import { DeleteProductUseCase } from 'src/product/domain/application/use-cases/delete-product';
import { ResourceNotFound } from 'src/core/errors/resource-not-found';
import { Public } from '../../auth/public';
import { deleteProductMock } from 'test/mocks/product/product';
import { ResourceAlreadyExists } from 'src/core/errors/resource-already-exists';

export const deleteProductQuerySchema = z.object({
  id: z.string().uuid(),
  reasonDelete: z.string().min(3).max(255),
});
export type DeleteProductQuery = z.infer<typeof deleteProductQuerySchema>;

const bodyValidationPipe = new ZodValidationPipe(deleteProductQuerySchema);

@ApiTags('Product')
@Controller('product')
@Public()
export class DeleteProductController {
  constructor(private deleteProductUseCase: DeleteProductUseCase) {}
  @Delete()
  @ApiOperation({ summary: 'Delete product' })
    @ApiBody({
      description: 'Product deletion payload',
      required: true,
      schema: { example: deleteProductMock },
    })
    @ApiResponse({
      status: 200,
      description: 'Product with id:${id} deleted',
    })
    @ApiResponse({ status: 400, description: 'Validation or other error' })

    async handle(@Body(bodyValidationPipe) body: DeleteProductQuery,){
        const response = await this.deleteProductUseCase.execute(body.id, body.reasonDelete);
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
        return { message: `Product with id:${body.id} deleted` };
    }

}