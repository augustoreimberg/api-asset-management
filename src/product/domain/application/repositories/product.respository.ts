import { PaginationParams } from 'src/core/repositories/pagination-params';
import { PaginatedResponse } from 'src/core/repositories/paginated-response';
import { Product } from '../../enterprise/entities/product';

export type GetProductsFilter = {
  id?: string;
  productType?: string;
  productCode?: string;
} & PaginationParams;

export abstract class ProductRepository {
  abstract create(product: Product): Promise<void>;
  abstract update(product: Product): Promise<void>;
  abstract findById(id: string): Promise<Product | null>;
  abstract findByTypeAndCode(
    type: string,
    code: string,
  ): Promise<Product | null>;
  abstract find(
    filter?: GetProductsFilter,
  ): Promise<PaginatedResponse<Product>>;
  abstract softDelete(id: string): Promise<void>;
  abstract findByEmployeeId(employeeId: string): Promise<any[]>;
}
