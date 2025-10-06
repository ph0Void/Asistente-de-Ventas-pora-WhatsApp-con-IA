import { WhatsAppController } from './controller/WhatsAppController';

async function main() {
    console.log('═══════════════════════════════════════════');
    console.log('    🤖 ASISTENTE DE VENTAS');
    console.log('═══════════════════════════════════════════');

    const whatsappBot = new WhatsAppController();
    
    try {
        await whatsappBot.start();
    } catch (error) {
        console.error(' Error fatal:', error);
        process.exit(1);
    }

    // Manejar señales de terminación
    process.on('SIGINT', async () => {
        console.log(' Cerrando aplicación...');
        await whatsappBot.stop();
        process.exit(0);
    });
}

main().catch(console.error);