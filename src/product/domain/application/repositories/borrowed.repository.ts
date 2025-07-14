import { Borrowed } from '../../enterprise/entities/borrowed';

export type GetBorrowedFilter = { 
  id?: string
  employeeId?: string
  productId?: string
  saidAt?: Date
  backAt?: Date
  deleted?: boolean
};

export abstract class BorrowedRepository {
  abstract create(borrowed: Borrowed): Promise<void>;
  abstract unlinkBorrowed(id: string, backAt: Date, reasonBack: string): Promise<void>;
  abstract find(filter?: GetBorrowedFilter): Promise<Borrowed[]>
  abstract findById(id: string): Promise<Borrowed | null>
  abstract findByProductId(id: string): Promise<Borrowed | null>
}
