import { IInvoice } from "../model/Model";
import { GoogleSheetRepository } from "../repository/SheetRepository";

export class InvoiceService {
    private sheetRepository: GoogleSheetRepository;
    private sheetName = 'Invoices';

    constructor() {
        this.sheetRepository = new GoogleSheetRepository();
    }

    async add(invoice: IInvoice) {
        try {
            console.log('Datos de factura recibidos:', invoice);
            
            invoice.id = Math.floor(Math.random() * 10000);

            const values = [
                invoice.id,
                invoice.customerDni,
                invoice.date,
                invoice.total,
                invoice.items
            ];

            
            const result = await this.sheetRepository
                .append(`${this.sheetName}!A2:E`, [values]);
            
            console.log('✅ FACTURA GUARDADA EXITOSAMENTE');
            
            return result;
        } catch (error) {
            console.error('\n❌ ════════ ERROR GUARDANDO FACTURA ════════');
            console.error('Error completo:', error);
            console.error('Datos de factura:', invoice);
            throw new Error(`Error al guardar factura: ${error instanceof Error ? error.message : 'Error desconocido'}`);
        }
    }

}