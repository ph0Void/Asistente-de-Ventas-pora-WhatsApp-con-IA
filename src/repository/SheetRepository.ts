import { google } from 'googleapis';
import { auth, SPREADSHEET_ID } from "../config/SheetConfig";

export class GoogleSheetRepository {
    private sheets;

    constructor() {
        this.sheets = google.sheets({ version: 'v4', auth });
    }

    /**
     * Lee datos de un rango específico en la hoja de cálculo.
     * @param range Ej: 'Sheet1!A1:C10'
     * @returns 
     */
    async read(range: string) {
        try {
            const response = await this.sheets.spreadsheets.values.get({
                spreadsheetId: SPREADSHEET_ID,
                range: range, // ej: '(nombreHoja)!A1:C10'
            });

            return response.data.values || [];
        } catch (error) {
            console.error('Error leyendo datos:', error);
            throw error;
        }
    }

    /**
     * Escribe datos en un rango específico de la hoja de cálculo.
     * @param range Ej: 'Sheet1!A1:C10'
     * @param values 
     * @returns 
     */
    async write(range: string, values: any[][]) {
        try {
            const response = await this.sheets.spreadsheets.values.update({
                spreadsheetId: SPREADSHEET_ID,
                range: range,
                valueInputOption: 'USER_ENTERED',
                requestBody: {
                    values: values
                }
            });

            return response.data;
        } catch (error) {
            console.error('Error escribiendo datos:', error);
            throw error;
        }
    }

    /**
     * Agrega datos al final de un rango específico en la hoja de cálculo.
     * @param range Ej: 'Sheet1!A1:C10'
     * @param values 
     * @returns 
     */
    async append(range: string, values: any[][]) {
        try {
            console.log('Configuración de Google Sheets:');
            console.log('- SPREADSHEET_ID:', SPREADSHEET_ID);
            console.log('- Range:', range);
            console.log('- Values:', values);

            const response = await this.sheets.spreadsheets.values.append({
                spreadsheetId: SPREADSHEET_ID,
                range: range,
                valueInputOption: 'USER_ENTERED',
                insertDataOption: 'INSERT_ROWS',
                requestBody: {
                    values: values
                }
            });

            console.log('Respuesta de Google Sheets:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error agregando datos a Google Sheets:');
            console.error('- Error:', error);
            console.error('- SPREADSHEET_ID:', SPREADSHEET_ID);
            console.error('- Range:', range);
            console.error('- Values:', values);
            throw new Error(`Error en Google Sheets API: ${error instanceof Error ? error.message : 'Error desconocido'}`);
        }
    }

    /**
     * Limpia un rango específico en la hoja de cálculo.
     * @param range Ej: 'Sheet1!A1:C10'
     * @returns 
     */
    async clear(range: string) {
        try {
            const response = await this.sheets.spreadsheets.values.clear({
                spreadsheetId: SPREADSHEET_ID,
                range: range
            });

            return response.data;
        } catch (error) {
            console.error('Error limpiando datos:', error);
            throw error;
        }
    }
}