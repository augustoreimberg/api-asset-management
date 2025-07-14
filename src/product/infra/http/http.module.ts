import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { HttpModule as HttpModuleAxios } from '@nestjs/axios';

import { CreateProductController } from './controllers/create-product.controller';
import { FetchProductsController } from './controllers/fetch-products.controller';
import { EditProductController } from './controllers/edit-product.controller';
import { DeleteProductController } from './controllers/delete-product.controller';

import { CreateProductUseCase } from 'src/product/domain/application/use-cases/create-product';
import { FetchProductsUseCase } from 'src/product/domain/application/use-cases/fetch-products';
import { EditProductUseCase } from 'src/product/domain/application/use-cases/edit-product';
import { FetchProductsByEmployeeIdUseCase } from 'src/product/domain/application/use-cases/fetch-products-by-employee-id';
import { DeleteProductUseCase } from 'src/product/domain/application/use-cases/delete-product';

import { ProductQueryAdapter } from './product-query.adapter';

@Module({
  imports: [DatabaseModule, HttpModuleAxios],
  controllers: [
    CreateProductController,
    FetchProductsController,
    EditProductController,
    DeleteProductController,
  ],

  providers: [
    CreateProductUseCase,
    FetchProductsUseCase,
    EditProductUseCase,
    FetchProductsByEmployeeIdUseCase,
    DeleteProductUseCase,
    { provide: 'IProductQueryContract', useClass: ProductQueryAdapter },
  ],
  exports: [
    FetchProductsByEmployeeIdUseCase,
    { provide: 'IProductQueryContract', useClass: ProductQueryAdapter },
  ],
})
export class HttpModule {}
