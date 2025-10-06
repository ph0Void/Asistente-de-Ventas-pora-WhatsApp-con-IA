import OpenAI from 'openai';
import { envConfig } from './EnvConfig';

export const openai = new OpenAI({
    baseURL: envConfig.OLLAMA_API_URL,
    apiKey: envConfig.OLLAMA_API_KEY,
});

export const MODEL_NAME = envConfig.OLLAMA_MODEL;