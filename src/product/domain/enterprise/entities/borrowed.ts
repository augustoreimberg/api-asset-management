import { Entity } from 'src/core/entities/entity';
import { UniqueEntityID } from 'src/core/entities/unique-entity-id';
import { Optional } from 'src/core/optional';

export type BorrowedProps = {
  productId: string;
  employeeId: string;
  saidAt: Date;
  backAt?: Date | null;
  createdAt?: Date;
  updatedAt?: Date | null;
  deletedAt?: Date | null;
  reasonDelete?: string | null;
};

export class Borrowed extends Entity<BorrowedProps> {
  get productId() {
    return this.props.productId;
  }

  set productId(productId: string) {
    this.props.productId = productId;
    this.touch();
  }

  get employeeId() {
    return this.props.employeeId;
  }

  set employeeId(employeeId: string) {
    this.props.employeeId = employeeId;
    this.touch();
  }

  get saidAt() {
    return this.props.saidAt;
  }

  set saidAt(saidAt: Date) {
    this.props.saidAt = saidAt;
    this.touch();
  }

  get backAt() {
    return this.props.backAt || null;
  }

  set backAt(backAt: Date | null) {
    this.props.backAt = backAt || null;
    this.touch();
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt || null;
  }

  get deletedAt() {
    return this.props.deletedAt || null;
  }

  get reasonDelete() {
    return this.props.reasonDelete || null;
  }

  set reasonDelete(reasonDelete: string | null) {
    this.props.reasonDelete = reasonDelete;
    this.touch();
  }

  private touch() {
    this.props.updatedAt = new Date();
  }

  public static create(
    props: Optional<BorrowedProps, 'createdAt'>,
    id?: UniqueEntityID,
  ) {
    const borrowed = new Borrowed(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    );
    return borrowed;
  }
}
