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
import { FetchBorrowedProductsUseCase } from 'src/product/domain/application/use-cases/fetch-borrowed-products';
import { BorrowedPresenter } from '../presenters/borrowed.presenter';
import { ResourceNotFound } from 'src/core/errors/resource-not-found';
import { Public } from '../../auth/public';

export const fetchBorrowedProductsQuerySchema = z.object({
  id: z.string().optional(),
  productId: z.string().optional(),
  employeeId: z.string().optional(),
  saidAt: z.coerce.date().optional(),
  backAt: z.coerce.date().optional(),
  deleted: z.preprocess(
    (val) => val === 'true' || val === true,
    z.boolean().optional(),
  ),
});

export type FetchBorrowedProductsQuerySchema = z.infer<
  typeof fetchBorrowedProductsQuerySchema
>;
const queryValidationPipe = new ZodValidationPipe(
  fetchBorrowedProductsQuerySchema,
);

@ApiTags('Borrowed')
@Controller('borrowed')
@Public()
export class FetchBorrowedProductsController {
  constructor(
    private fetchBorrowedProductsUseCase: FetchBorrowedProductsUseCase,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Fetch borrowed products' })
  @ApiQuery({
    name: 'id',
    type: String,
    required: false,
  })
  @ApiQuery({
    name: 'productId',
    type: String,
    required: false,
  })
  @ApiQuery({
    name: 'employeeId',
    type: String,
    required: false,
  })
  @ApiQuery({
    name: 'saidAt',
    type: Date,
    required: false,
  })
  @ApiQuery({
    name: 'backAt',
    type: Date,
    required: false,
  })
  @ApiQuery({
    name: 'deleted',
    type: Boolean,
    required: false,
  })
  @ApiResponse({ status: 200, type: [BorrowedPresenter] })
  @ApiResponse({ status: 404, description: 'No product found' })
  @ApiResponse({ status: 400, description: 'Validation or other error' })
  async handle(
    @Query(queryValidationPipe) query: FetchBorrowedProductsQuerySchema,
  ) {
    const response = await this.fetchBorrowedProductsUseCase.execute(query);
    if (response.isLeft()) {
      const error = response.value;
      if (error instanceof ResourceNotFound) {
        throw new NotFoundException(error.message);
      }
      throw new BadRequestException(error);
    }
    return response.value.map(BorrowedPresenter.toHTTP);
  }
}
