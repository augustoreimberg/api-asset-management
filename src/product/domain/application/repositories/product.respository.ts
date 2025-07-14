import { PaginationParams } from 'src/core/repositories/pagination-params';
import { PaginatedResponse } from 'src/core/repositories/paginated-response';
import { Product } from '../../enterprise/entities/product';
import { Borrowed } from '../../enterprise/entities/borrowed';

export type GetProductsFilter = {
  id?: string;
  name?: string;
  productType?: string;
  productCode?: string;
  deleted?: boolean;
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
  abstract findProductBorrowedById(id: string): Promise<any[]>;
  abstract softDelete(id: string, reasonDelete: string): Promise<void>;
  abstract findByEmployeeId(employeeId: string): Promise<any[]>;
}
