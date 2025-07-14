import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { PrismaProductRepository } from './prisma/repositories/prisma-product.repository';
import { ProductRepository } from 'src/product/domain/application/repositories/product.respository';
import { EmployeeQueryAdapter } from '../http/adapters/employee-query.adapter';
import { IEmployeeQueryContract } from 'src/product/domain/application/contracts/employee-contract';
import { DatabaseModule as EmployeeDatabaseModule } from 'src/employee/infra/database/database.module';
import { PrismaEmployeeRepository } from 'src/employee/infra/database/prisma/repositories/prisma-employee.repository';
import { PrismaBorrowedRepository } from './prisma/repositories/prisma-borrowed.repository';
import { BorrowedRepository } from 'src/product/domain/application/repositories/borrowed.repository';

@Module({
  imports: [EmployeeDatabaseModule],
  providers: [
    PrismaService,
    PrismaProductRepository,
    EmployeeQueryAdapter,
    PrismaEmployeeRepository,
    PrismaBorrowedRepository,
    {
      provide: ProductRepository,
      useClass: PrismaProductRepository,
    },
    {
      provide: 'IEmployeeQueryContract',
      useClass: EmployeeQueryAdapter,
    },
    {
      provide: BorrowedRepository,
      useClass: PrismaBorrowedRepository,
    },
  ],
  exports: [
    PrismaService,
    {
      provide: ProductRepository,
      useClass: PrismaProductRepository,
    },
    {
      provide: 'IEmployeeQueryContract',
      useClass: EmployeeQueryAdapter,
    },
    {
      provide: BorrowedRepository,
      useClass: PrismaBorrowedRepository,
    },
  ],
})
export class DatabaseModule {}
