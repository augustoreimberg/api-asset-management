import { Entity } from "src/core/entities/entity";
import { UniqueEntityID } from "src/core/entities/unique-entity-id";
import { Optional } from "src/core/optional";

export type ProductProps = {
    productType : string;
    productCode : string;
    createdAt?: Date;
    updatedAt?: Date | null;
    deletedAt?: Date | null;
}

export class Product extends Entity<ProductProps> {

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

    private touch() {
        this.props.updatedAt = new Date();
    }

    public static create(
        props: Optional<ProductProps, 'createdAt'>,
        id?: UniqueEntityID,
    ) {
        const product = new Product({
            ...props,
            createdAt: props.createdAt ?? new Date(),
        }, id);
        return product;
    }
}