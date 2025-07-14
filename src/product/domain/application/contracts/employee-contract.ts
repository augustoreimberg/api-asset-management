export interface IEmployeeQueryContract {
  findById(employeeId: string): Promise<any | null>;
}
