import { GoogleSheetRepository } from "../repository/SheetRepository";

export class ProductService {
    private sheetRepository: GoogleSheetRepository;
    private sheetName = 'Products';

    constructor() {
        this.sheetRepository = new GoogleSheetRepository();
    }

    async getAll() {
        const rows = await this.sheetRepository
            .read(`${this.sheetName}!A2:D`);

        return rows.map((row: any[]) => ({
            id: row[0],
            name: row[1],
            price: row[2],
            stock: row[3]
        }));
    }

    async findByName(name: string) {
        const products = await this.getAll();
        return products
            .find(p => p.name.toLowerCase().includes(name.toLowerCase()));
    }
}