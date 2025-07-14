export const createProductMock = {
    name: 'Notebook 1234',
    productType: 'NOTEBOOK',
    productCode: '1234'
}

export const editProductMock = {
    id: 'account-uuid',
    name: 'Notebook 1234',
    productType: 'NOTEBOOK',
    productCode: '4321'
}

export const responseProductMock = {
    id: 'account-uuid',
    name: 'Notebook 1234',
    productType: 'NOTEBOOK',
    productCode: '1234',
    reasonDelete: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null
}

export const deleteProductMock = {
    id: 'account-uuid',
    reasonDelete: 'any reason'
};

export const createBorrowedMock = {
    employeeId: 'id-uuid',
    productId: 'product-uuid',
    saidAt: new Date()
}

export const unlinkBorrowedMock = {
    id: 'id-uuid',
    backAt: new Date(),
    reasonBack: 'any reason'
}

export const responseBorrowedMock = {
    id: 'id-uuid',
    employeeId: 'account-uuid',
    productId: 'product-uuid',
    saidAt: new Date(),
    backAt: null,
    reasonBack: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null
}