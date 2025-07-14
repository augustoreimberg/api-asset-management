import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { HttpModule as HttpModuleAxios } from '@nestjs/axios';
import { HttpModule as ProductHttpModule } from 'src/product/infra/http/http.module';

import { CreateEmployeeController } from './controllers/create-employee.controller';
import { FetchEmployeeController } from './controllers/fetch-employee.controller';
import { EditEmployeeController } from './controllers/edit-employee.controller';
import { DeleteEmployeeController } from './controllers/delete-employee.controller';

import { CreateEmployeeUseCase } from 'src/employee/domain/application/use-cases/create-employees';
import { FetchEmployeesUseCase } from 'src/employee/domain/application/use-cases/fetch-employees';
import { EditEmployeeUseCase } from 'src/employee/domain/application/use-cases/edit-employee';
import { DeleteEmployeeUseCase } from 'src/employee/domain/application/use-cases/delete-employees';

@Module({
  imports: [DatabaseModule, HttpModuleAxios, ProductHttpModule],
  controllers: [
    CreateEmployeeController,
    FetchEmployeeController,
    EditEmployeeController,
    DeleteEmployeeController,
  ],

  providers: [
    CreateEmployeeUseCase,
    FetchEmployeesUseCase,
    EditEmployeeUseCase,
    DeleteEmployeeUseCase,
  ],
})
export class HttpModule {}
