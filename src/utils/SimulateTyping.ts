import { Chat } from "whatsapp-web.js";

export async function simulateTyping(chat: Chat, messageLength?: number) {

    await chat.sendStateTyping();

    const typingDuration = Math.max(100, (messageLength || 0) * 20);

    await new Promise(resolve => setTimeout(resolve, typingDuration));

    await chat.clearState();
}

export async function simulateTypingAndSend(chat: Chat, message: string) {
    await simulateTyping(chat, 500);
    await chat.sendMessage(message);
}