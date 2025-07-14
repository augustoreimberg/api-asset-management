import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { HttpModule as HttpModuleAxios } from '@nestjs/axios';

import { CreateProductController } from './controllers/create-product.controller';
import { FetchProductsController } from './controllers/fetch-products.controller';
import { EditProductController } from './controllers/edit-product.controller';
import { DeleteProductController } from './controllers/delete-product.controller';
import { CreateBorrowedController } from './controllers/create-borrowed.controller';

import { CreateProductUseCase } from 'src/product/domain/application/use-cases/create-product';
import { FetchProductsUseCase } from 'src/product/domain/application/use-cases/fetch-products';
import { EditProductUseCase } from 'src/product/domain/application/use-cases/edit-product';
import { FetchProductsByEmployeeIdUseCase } from 'src/product/domain/application/use-cases/fetch-products-by-employee-id';
import { DeleteProductUseCase } from 'src/product/domain/application/use-cases/delete-product';
import { CreateBorrowedProductUseCase } from 'src/product/domain/application/use-cases/create-borrowed-product';

import { ProductQueryAdapter } from './adapters/product-query.adapter';
import { EmployeeQueryAdapter } from './adapters/employee-query.adapter';
import { IEmployeeQueryContract } from 'src/product/domain/application/contracts/employee-contract';
import { DatabaseModule as EmployeeDatabaseModule } from 'src/employee/infra/database/database.module';

@Module({
  imports: [DatabaseModule, EmployeeDatabaseModule, HttpModuleAxios],
  controllers: [
    CreateProductController,
    FetchProductsController,
    EditProductController,
    DeleteProductController,
    CreateBorrowedController,
  ],

  providers: [
    CreateProductUseCase,
    FetchProductsUseCase,
    EditProductUseCase,
    FetchProductsByEmployeeIdUseCase,
    DeleteProductUseCase,
    CreateBorrowedProductUseCase,
    { provide: 'IProductQueryContract', useClass: ProductQueryAdapter },
    { provide: 'IEmployeeQueryContract', useClass: EmployeeQueryAdapter },
  ],
  exports: [
    FetchProductsByEmployeeIdUseCase,
    { provide: 'IProductQueryContract', useClass: ProductQueryAdapter },
    { provide: 'IEmployeeQueryContract', useClass: EmployeeQueryAdapter },
  ],
})
export class HttpModule {}
