import {
  BadRequestException,
  Query,
  Controller,
  NotFoundException,
  Get,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { z } from 'zod';
import { ZodValidationPipe } from '../pipes/zod-validation-pipe';
import { FetchProductsUseCase } from 'src/product/domain/application/use-cases/fetch-products';
import { ProductPresenter } from '../presenters/product.presenter';
import { ResourceNotFound } from 'src/core/errors/resource-not-found';
import { Public } from '../../auth/public';
import { responseProductMock } from 'test/mocks/product/product';

export const fetchProductsQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  id: z.string().optional(),
  productCode: z.string().optional(),
  productType: z.enum(['NOTEBOOK', 'CHARGER', 'MONITOR', 'MOUSE', 'KEYBOARD', 'HEADPHONE']).optional(),
});
export type FetchProductsQuerySchema = z.infer<typeof fetchProductsQuerySchema>;
const queryValidationPipe = new ZodValidationPipe(fetchProductsQuerySchema);

@ApiTags('Product')
@Controller('products')
@Public()
export class FetchProductsController {
  constructor(private fetchProductsUseCase: FetchProductsUseCase) {}
  @Get()
    @ApiOperation({ summary: 'List products with pagination and filters' })
    @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
    @ApiQuery({ name: 'id', required: false, type: String })
    @ApiQuery({ name: 'productCode', required: false, type: String })
    @ApiQuery({ name: 'productType', required: false, type: String })
    @ApiResponse({
      status: 200,
      description: 'Paginated list of products',
      schema: {
        example: {
          data: [responseProductMock],
          total: 1,
          page: 1,
          lastPage: 1,
          hasMore: false,
        },
      },
    })
    @ApiResponse({ status: 404, description: 'No product found' })
    @ApiResponse({ status: 400, description: 'Validation or other error' })
    async handle(@Query(queryValidationPipe) query: FetchProductsQuerySchema) {
      const response = await this.fetchProductsUseCase.execute(query);
      if (response.isLeft()) {
        const error = response.value;
        if (error instanceof ResourceNotFound) {
          throw new NotFoundException(error.message);
        }
        throw new BadRequestException(error);
      }
      return {
        ...response.value,
        data: response.value.data.map(ProductPresenter.toHTTP),
      };
    }
}