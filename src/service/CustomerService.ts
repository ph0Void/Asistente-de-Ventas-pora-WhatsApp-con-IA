import { ICustomer } from "../model/Model";
import { GoogleSheetRepository } from "../repository/SheetRepository";

export class CustomerService {
    private sheetRepository: GoogleSheetRepository;
    private sheetName = 'Customers';
    constructor() {
        this.sheetRepository = new GoogleSheetRepository();
    }

    async getAll() {
        const rows = await this.sheetRepository
            .read(`${this.sheetName}!A2:D`);

        return rows.map((row: any[]) => ({
            id: row[0],
            name: row[1],
            phoneNumber: row[2],
            dni: row[3]
        }));
    }

    async add(customer: ICustomer) {
        try {
            console.log('Datos del cliente recibidos:', customer);
            
            customer.id = Math.floor(Math.random() * 10000);

            const values = [
                customer.id,
                customer.name,
                customer.phone,
                customer.dni
            ];

            
            const result = await this.sheetRepository
                .append(`${this.sheetName}!A2:D`, [values]);
            
            console.log('✅ CLIENTE GUARDADO EXITOSAMENTE');
            
            return result;
        } catch (error) {
            console.error('\n❌ ════════ ERROR GUARDANDO CLIENTE ════════');
            console.error('Error completo:', error);
            throw new Error(`Error al guardar cliente: ${error instanceof Error ? error.message : 'Error desconocido'}`);
        }
    }

    async findById(id: number) {
        const customers = await this.getAll();
        return customers.find(c => Number(c.id) === id);
    }

}