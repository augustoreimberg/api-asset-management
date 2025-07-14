import { Borrowed } from "src/product/domain/enterprise/entities/borrowed";

export class BorrowedPresenter {
    static toHTTP(borrowed: Borrowed) {
        return {
            id: borrowed.id.toValue(),
            employeeId: borrowed.employeeId,
            productId: borrowed.productId,
            saidAt: borrowed.saidAt,
            backAt: borrowed.backAt,
            createdAt: borrowed.createdAt,
            updatedAt: borrowed.updatedAt,
            deletedAt: borrowed.deletedAt,
            reasonBack: borrowed.reasonBack,
        };
    }
}