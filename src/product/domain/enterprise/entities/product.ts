import { Entity } from 'src/core/entities/entity';
import { UniqueEntityID } from 'src/core/entities/unique-entity-id';
import { Optional } from 'src/core/optional';

export type ProductProps = {
  name: string;
  productType: string;
  productCode: string;
  reasonDelete?: string | null;
  createdAt?: Date;
  updatedAt?: Date | null;
  deletedAt?: Date | null;
  available?: boolean;
};

export class Product extends Entity<ProductProps> {
  get name() {
    return this.props.name;
  }

  set name(name: string) {
    this.props.name = name;
    this.touch();
  }

  get productType() {
    return this.props.productType;
  }

  set productType(productType: string) {
    this.props.productType = productType;
    this.touch();
  }

  get productCode() {
    return this.props.productCode;
  }

  set productCode(productCode: string) {
    this.props.productCode = productCode;
    this.touch();
  }

  get reasonDelete() {
    return this.props.reasonDelete || null;
  }

  set reasonDelete(reasonDelete: string | null) {
    this.props.reasonDelete = reasonDelete;
    this.touch();
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt || null;
  }

  set updatedAt(updatedAt: Date | null) {
    this.props.updatedAt = updatedAt;
    this.touch();
    return;
  }

  get deletedAt() {
    return this.props.deletedAt || null;
  }

  get available() {
    return this.props.available;
  }

  set available(value: boolean | undefined) {
    this.props.available = value;
  }

  private touch() {
    this.props.updatedAt = new Date();
  }

  public static create(
    props: Optional<ProductProps, 'createdAt'>,
    id?: UniqueEntityID,
  ) {
    const product = new Product(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    );
    return product;
  }
}
