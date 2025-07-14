import { Injectable } from '@nestjs/common';
import { ProductRepository } from '../repositories/product.respository';

export interface IFetchProductsByEmployeeIdUseCase {
  execute(employeeId: string): Promise<any[]>;
}

@Injectable()
export class FetchProductsByEmployeeIdUseCase
  implements IFetchProductsByEmployeeIdUseCase
{
  constructor(private readonly productRepository: ProductRepository) {}

  async execute(employeeId: string): Promise<any[]> {
    return this.productRepository.findByEmployeeId(employeeId);
  }
}
