import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HttpModule as HttpModuleEmployee } from './employee/infra/http/http.module';
import { HttpModule as HttpModuleProduct } from './product/infra/http/http.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    HttpModuleEmployee,
    HttpModuleProduct,
  ],
})
export class AppModule {}
