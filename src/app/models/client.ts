export interface Client {
    id: number,
    name: string,
    lastName: string,
    address: string,
    username: string,
    password: string,
    email: string,
    birthday: string,
    maritalStatus: string,
    phoneNumber: string,
    gender: string,
    dni: string,
    ruc: string,
    currencyType: string,
    monthlyIncome: number,
    enabled: boolean,
    roles: { nameRol: string }[];
}