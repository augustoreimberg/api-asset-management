import { Borrowed } from '../../enterprise/entities/borrowed';

export abstract class BorrowedRepository {
  abstract create(borrowed: Borrowed): Promise<void>;
}
