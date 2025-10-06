export interface IProduct {
    id: number;
    name: string;
    price: number;
    stock: number;
}

export interface ICustomer {
    id: number;
    name: string;
    phone: string;
    dni: string;
}

export interface IInvoice {
    id: number;
    customerDni: string;
    date: string;
    total: number;
    items: string; // CONVERTIR A JSON STRING
}