import { Module, forwardRef } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { HttpModule as HttpModuleAxios } from '@nestjs/axios';
import { HttpModule as EmployeeHttpModule } from 'src/employee/infra/http/http.module';

import { CreateProductController } from './controllers/create-product.controller';
import { FetchProductsController } from './controllers/fetch-products.controller';
import { EditProductController } from './controllers/edit-product.controller';
import { DeleteProductController } from './controllers/delete-product.controller';
import { CreateBorrowedController } from './controllers/create-borrowed.controller';
import { UnlinkBorrowedController } from './controllers/unlink-borrowed.controller';
import { FetchBorrowedProductsController } from './controllers/fetch-borrowed-products.controller';

import { CreateProductUseCase } from 'src/product/domain/application/use-cases/create-product';
import { FetchProductsUseCase } from 'src/product/domain/application/use-cases/fetch-products';
import { EditProductUseCase } from 'src/product/domain/application/use-cases/edit-product';
import { FetchProductsByEmployeeIdUseCase } from 'src/product/domain/application/use-cases/fetch-products-by-employee-id';
import { DeleteProductUseCase } from 'src/product/domain/application/use-cases/delete-product';
import { CreateBorrowedProductUseCase } from 'src/product/domain/application/use-cases/create-borrowed-product';
import { UnlinkBorrowedProductUseCase } from 'src/product/domain/application/use-cases/unlink-borrowed-product';
import { FetchBorrowedProductsUseCase } from 'src/product/domain/application/use-cases/fetch-borrowed-products';

import { ProductQueryAdapter } from './adapters/product-query.adapter';
import { EmployeeQueryAdapter } from 'src/employee/infra/http/adapters/employee-query.adapter';
import { IEmployeeQueryContract } from 'src/product/domain/application/contracts/employee-contract';
import { DatabaseModule as EmployeeDatabaseModule } from 'src/employee/infra/database/database.module';

@Module({
  imports: [
    DatabaseModule,
    EmployeeDatabaseModule,
    HttpModuleAxios,
    forwardRef(() => EmployeeHttpModule),
  ],
  controllers: [
    CreateProductController,
    FetchProductsController,
    EditProductController,
    DeleteProductController,
    CreateBorrowedController,
    UnlinkBorrowedController,
    FetchBorrowedProductsController,
  ],

  providers: [
    CreateProductUseCase,
    FetchProductsUseCase,
    EditProductUseCase,
    FetchProductsByEmployeeIdUseCase,
    DeleteProductUseCase,
    CreateBorrowedProductUseCase,
    UnlinkBorrowedProductUseCase,
    FetchBorrowedProductsUseCase,
    { provide: 'IProductQueryContract', useClass: ProductQueryAdapter },
  ],
  exports: [
    FetchProductsByEmployeeIdUseCase,
    { provide: 'IProductQueryContract', useClass: ProductQueryAdapter },
  ],
})
export class HttpModule {}
