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