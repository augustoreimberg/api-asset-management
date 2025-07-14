export interface IProductQueryContract {
  findByEmployeeId(employeeId: string): Promise<any[]>;
}
