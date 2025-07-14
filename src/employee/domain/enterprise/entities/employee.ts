import { Entity } from 'src/core/entities/entity';
import { UniqueEntityID } from 'src/core/entities/unique-entity-id';
import { Optional } from 'src/core/optional';
import { Product } from 'src/product/domain/enterprise/entities/product';

export type EmployeeProps = {
  name: string;
  email: string;
  filial: string;
  nationality: string;
  maritalStatus: string;
  birthDate: Date;
  cpf: string;
  rg: string;
  address: string;
  houseNumber: string;
  neighborhood: string;
  city: string;
  state: string;
  cep: string;
  createdAt?: Date;
  updatedAt?: Date | null;
  deletedAt?: Date | null;
  produtos?: any[]; // Adicione o campo produtos (relacionamento)
};

export class Employee extends Entity<EmployeeProps> {
  get name() {
    return this.props.name;
  }

  set name(name: string) {
    this.props.name = name;
    this.touch();
  }

  get email() {
    return this.props.email;
  }

  set email(email: string) {
    this.props.email = email;
    this.touch();
  }

  get filial() {
    return this.props.filial;
  }

  set filial(filial: string) {
    this.props.filial = filial;
    this.touch();
  }

  get nationality() {
    return this.props.nationality;
  }

  set nationality(nationality: string) {
    this.props.nationality = nationality;
    this.touch();
  }

  get maritalStatus() {
    return this.props.maritalStatus;
  }

  set maritalStatus(maritalStatus: string) {
    this.props.maritalStatus = maritalStatus;
    this.touch();
  }

  get birthDate() {
    return this.props.birthDate;
  }

  set birthDate(birthDate: Date) {
    this.props.birthDate = birthDate;
    this.touch();
  }

  get cpf() {
    return this.props.cpf;
  }

  set cpf(cpf: string) {
    this.props.cpf = cpf;
    this.touch();
  }

  get rg() {
    return this.props.rg;
  }

  set rg(rg: string) {
    this.props.rg = rg;
    this.touch();
  }

  get address() {
    return this.props.address;
  }

  set address(address: string) {
    this.props.address = address;
    this.touch();
  }

  get houseNumber() {
    return this.props.houseNumber;
  }

  set houseNumber(houseNumber: string) {
    this.props.houseNumber = houseNumber;
    this.touch();
  }

  get neighborhood() {
    return this.props.neighborhood;
  }

  set neighborhood(neighborhood: string) {
    this.props.neighborhood = neighborhood;
    this.touch();
  }

  get city() {
    return this.props.city;
  }

  set city(city: string) {
    this.props.city = city;
    this.touch();
  }

  get state() {
    return this.props.state;
  }

  set state(state: string) {
    this.props.state = state;
    this.touch();
  }

  get cep() {
    return this.props.cep;
  }

  set cep(cep: string) {
    this.props.cep = cep;
    this.touch();
  }

  get produtos() {
    return this.props.produtos ?? [];
  }

  set produtos(produtos: any[]) {
    this.props.produtos = produtos;
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
    props: Optional<EmployeeProps, 'createdAt'>,
    id?: UniqueEntityID,
  ) {
    const employee = new Employee(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    );
    return employee;
  }
}
