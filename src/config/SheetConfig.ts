import { google } from "googleapis";
import { envConfig } from "./EnvConfig";


export const auth = new google.auth.GoogleAuth({
    keyFile: envConfig.PATH_SHEETS_KEY_FILE,
    scopes: [envConfig.GOOGLE_AUTH_SHEETS],
});

export const SPREADSHEET_ID = envConfig.SPREADSHEET_ID!;