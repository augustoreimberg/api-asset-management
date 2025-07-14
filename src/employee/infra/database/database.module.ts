import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { PrismaEmployeeRepository } from './prisma/repositories/prisma-employee.repository';
import { EmployeeRepository } from 'src/employee/domain/application/repositories/employee.repository';

@Module({
  providers: [
    PrismaService,
    PrismaEmployeeRepository,
    {
      provide: EmployeeRepository,
      useClass: PrismaEmployeeRepository,
    },
  ],
  exports: [
    PrismaService,
    {
      provide: EmployeeRepository,
      useClass: PrismaEmployeeRepository,
    },
  ],
})
export class DatabaseModule {}
