import { Employee } from 'src/employee/domain/enterprise/entities/employee';

export class EmployeePresenter {
  static toHTTP(employee: Employee) {
    return {
      id: employee.id.toString(),
      name: employee.name,
      email: employee.email,
      filial: employee.filial,
      nationality: employee.nationality,
      maritalStatus: employee.maritalStatus,
      birthDate: employee.birthDate,
      cpf: employee.cpf,
      rg: employee.rg,
      address: employee.address,
      houseNumber: employee.houseNumber,
      neighborhood: employee.neighborhood,
      city: employee.city,
      state: employee.state,
      cep: employee.cep,
      createdAt: employee.createdAt,
      updatedAt: employee.updatedAt,
      deletedAt: employee.deletedAt,
      products:
        employee.produtos?.map((p: any) => ({
          id: p.id,
          borrowedId: p.borrowed_id,
          name: p.product?.name || p.name,
          productType: p.product?.productType || p.productType,
          productCode: p.product?.productCode || p.productCode,
          saidAt: p.saidAt,
          backAt: p.backAt,
        })) || [],
    };
  }
}
