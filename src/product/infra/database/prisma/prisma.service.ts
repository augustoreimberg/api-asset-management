import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    super({
      log: ['info', 'warn', 'error'],
    });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  async softDelete(model: string, where: any) {
    const entity = (this as any)[model];
    if (!entity || !entity.update) {
      throw new Error(`Model ${model} not found`);
    }

    return entity.update({
      where,
      data: {
        deletedAt: new Date(),
      },
    });
  }
}
