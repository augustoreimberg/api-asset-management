import { Injectable } from '@nestjs/common';
import { ProductRepository } from 'src/product/domain/application/repositories/product.respository';
import { IProductQueryContract } from 'src/employee/domain/application/contracts/product-contract';

@Injectable()
export class ProductQueryAdapter implements IProductQueryContract {
  constructor(private readonly productRepository: ProductRepository) {}

  async findByEmployeeId(employeeId: string): Promise<any[]> {
    return this.productRepository.findByEmployeeId(employeeId);
  }
}
