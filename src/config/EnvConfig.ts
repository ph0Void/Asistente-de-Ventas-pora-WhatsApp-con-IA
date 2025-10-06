import dotenv from 'dotenv';

dotenv.config();

export const envConfig = {
    SPREADSHEET_ID: process.env.SPREADSHEET_ID!,
    SHEET_LINK: process.env.SHEET_LINK!,
    PATH_SHEETS_KEY_FILE: process.env.PATH_SHEETS_KEY_FILE!,
    GOOGLE_AUTH_SHEETS: process.env.GOOGLE_AUTH_SHEETS!,

    OLLAMA_MODEL: process.env.OLLAMA_MODEL!,
    OLLAMA_API_URL: process.env.OLLAMA_API_URL!,
    OLLAMA_API_KEY: process.env.OLLAMA_API_KEY!,
}