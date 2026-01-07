const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const token = process.env.BOT_TOKEN;
if (!token) {
  console.error('Error: BOT_TOKEN no definido en .env');
  process.exit(1);
}

const configPath = path.join(__dirname, 'config', 'basic-info.json');
let info = JSON.parse(fs.readFileSync(configPath, 'utf8'));

const bot = new TelegramBot(token, { polling: true });

// --- Comando /start (unificado con botones y publicidad) ---
bot.onText(/^\/start$/, (msg) => {
  const chatId = msg.chat.id;

  const bienvenida = `
🚀 Bienvenido al bot oficial de ${info.tokenName}! 🚀  
Usa los botones para acceder a la información:
  `;

  // Publicidad automática
  const publicidadInicial = `
📢 Anuncio oficial:
🔥 Únete a la revolución DeFi con ${info.tokenName}: liquidez estable, transparencia total y comunidad en crecimiento.
  `;

  bot.sendMessage(chatId, bienvenida, {
    reply_markup: {
      inline_keyboard: [
        [{ text: "📊 Info del Token", callback_data: "info" }],
        [{ text: "🔗 Enlaces Oficiales", callback_data: "links" }],
        [{ text: "📢 Publicidad Oficial", callback_data: "publicidad" }]
      ]
    }
  });

  // Enviar publicidad inicial automáticamente
  bot.sendMessage(chatId, publicidadInicial);
});

// --- Comando /info ---
bot.onText(/^\/info$/, (msg) => {
  const text = `📊 ${info.tokenName} (${info.symbol})\n• Supply: ${info.supply}\n• Decimals: ${info.decimals}\n• Contract: ${info.contractAddress}\n• Explorer: ${info.explorerUrl}`;
  bot.sendMessage(msg.chat.id, text);
});

// --- Comando /links ---
bot.onText(/^\/links$/, (msg) => {
  const links = Object.entries(info.links)
    .map(([k, v]) => `• ${k}: ${v}`)
    .join('\n');
  bot.sendMessage(msg.chat.id, `🔗 Enlaces oficiales:\n${links}`);
});

// --- Comando /announce (solo admin por username) ---
const ADMIN_USERNAME = "Omgal76"; // <-- tu usuario administrador sin @

bot.onText(/^\/announce (.+)$/, (msg, match) => {
  const chatId = msg.chat.id;
  const username = msg.from.username;

  if (username !== ADMIN_USERNAME) {
    bot.sendMessage(chatId, "⛔ No tienes permisos para usar este comando.");
    return;
  }

  const announcement = match[1];
  bot.sendMessage(chatId, `📢 Anuncio oficial:\n${announcement}`);
});

// --- Manejo de botones ---
bot.on("callback_query", (query) => {
  const chatId = query.message.chat.id;

  if (query.data === "info") {
    const text = `📊 ${info.tokenName} (${info.symbol})\n• Supply: ${info.supply}\n• Decimals: ${info.decimals}\n• Contract: ${info.contractAddress}\n• Explorer: ${info.explorerUrl}`;
    bot.sendMessage(chatId, text);
  }

  if (query.data === "links") {
    const links = Object.entries(info.links)
      .map(([k, v]) => `• ${k}: ${v}`)
      .join("\n");
    bot.sendMessage(chatId, `🔗 Enlaces oficiales:\n${links}`);
  }

  if (query.data === "publicidad") {
    const publicidad = `
📢 Anuncio oficial:
🔥 Únete a la revolución DeFi con ${info.tokenName}: liquidez estable, transparencia total y comunidad en crecimiento.
    `;
    bot.sendMessage(chatId, publicidad);
  }

  bot.answerCallbackQuery(query.id); // confirma la acción del botón
});

console.log('Bot DOATokenV2 iniciado...');
