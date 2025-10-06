import { Client, LocalAuth, Message } from 'whatsapp-web.js';
import * as qrcode from 'qrcode-terminal';
import { AssistantService } from '../chatbot/AssistantService';
import { simulateTypingAndSend } from '../utils/SimulateTyping';

export class WhatsAppController {
    private client: Client;
    private assistantService: AssistantService;
    private conversations: Map<string, any[]> = new Map();

    constructor() {
        this.client = new Client({
            authStrategy: new LocalAuth(),
            puppeteer: {
                headless: true,
                args: ['--no-sandbox']
            }
        });

        this.assistantService = new AssistantService();
        this.initializeEvents();
    }

    private initializeEvents() {
        // Evento QR
        this.client.on('qr', (qr) => {
            console.log('\n📱 Escanea este código QR con WhatsApp:');
            qrcode.generate(qr, { small: true });
        });

        this.client.on('ready', () => {
            console.log('\n✅ WhatsApp Bot está listo!');
            console.log('🤖 Asistente de ventas activado');
            console.log('💬 Esperando mensajes...\n');
        });

        this.client.on('message', async (message: Message) => {
            if (message.from.includes('@g.us') || message.isStatus) return;
            
            if (message.fromMe) return;

            await this.handleMessage(message);
        });

        this.client.on('disconnected', (reason) => {
            console.log('❌ Bot desconectado:', reason);
        });
    }

    private async handleMessage(message: Message) {
        try {
            const userId = message.from;
            const userMessage = message.body;
            const chat = await message.getChat();

            console.log(`\n📩 Mensaje de ${userId}: ${userMessage}`);

            if (!this.conversations.has(userId)) {
                this.conversations.set(userId, []);
            }
            const history = this.conversations.get(userId)!;

            const response = await this.assistantService.processMessage(userMessage, history);

            history.push(
                { role: 'user', content: userMessage },
                { role: 'assistant', content: response }
            );

            if (history.length > 20) {
                history.splice(0, history.length - 20);
            }

            await simulateTypingAndSend(chat, response);

        } catch (error) {
            console.error('❌ Error procesando mensaje:', error);
            const chat = await message.getChat();
            await chat.sendMessage('Lo siento, hubo un error. Por favor intenta de nuevo.');
        }
    }

    public async start() {
        console.log('🚀 Iniciando WhatsApp Bot...');
        await this.client.initialize();
    }

    public async stop() {
        console.log('⏹️ Deteniendo WhatsApp Bot...');
        await this.client.destroy();
    }
}