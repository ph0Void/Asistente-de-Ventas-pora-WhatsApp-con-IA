import { envConfig } from "../config/EnvConfig";

export async function ollamaChat(prompt: string) {
    try {
        
        const response = await fetch(`${envConfig.OLLAMA_API_URL}/api/generate`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: envConfig.OLLAMA_MODEL,
                prompt: prompt,
                stream: false
            })
        });

        //console.log('Estado HTTP:', response.status, response.statusText);

        if (!response.ok) {
            throw new Error(`MODEL API error: ${response.statusText}`);
        }

        const data = await response.json();
        return data.response;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}