const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// --- Ruta fija al .env principal ---
const envPath = path.join(__dirname, '..', '.env');
dotenv.config({ path: envPath });

// --- Variables desde el .env principal ---
const token = process.env.TELEGRAM_BOT_TOKEN;
const CHANNEL_ID = process.env.TELEGRAM_CHAT_ID;
const ADMIN_USERNAME = process.env.ADMIN_USERNAME;

if (!token || !CHANNEL_ID || !ADMIN_USERNAME) {
  console.error(`❌ Faltan variables en ${envPath}: TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID o ADMIN_USERNAME`);
  process.exit(1);
}

const configPath = path.join(__dirname, 'config', 'basic-info.json');
let info = {};
try {
  info = JSON.parse(fs.readFileSync(configPath, 'utf8'));
} catch {
  console.warn('⚠️ No se pudo cargar basic-info.json, se continuará sin esa info.');
}

// --- Inicialización del bot con polling robusto ---
const bot = new TelegramBot(token, {
  polling: {
    interval: 2000,       // tiempo entre intentos de reconexión
    autoStart: true,     // arranca automáticamente
    params: {
      timeout: 60        // timeout de long polling en segundos
    }
  }
});

console.log('🚀 Bot DOATokenV2 iniciado...');

// --- Comando /start ---
bot.onText(/^\/start$/, (msg) => {
  const chatId = msg.chat.id;

  const bienvenida = `
🚀 Bienvenido al bot oficial de ${info.tokenName}! 🚀  
Usa los botones para acceder a la información:
  `;

  const publicidadInicial = `
📢 Anuncio oficial:
🔥 Únete a la revolución DeFi con ${info.tokenName}: liquidez estable, transparencia total y comunidad en crecimiento.
  `;

  bot.sendMessage(chatId, bienvenida, {
    reply_markup: {
      inline_keyboard: [
        [{ text: "📊 Info del Token", callback_data: "info" }],
        [{ text: "🔗 Enlaces Oficiales", callback_data: "links" }],
        [{ text: "📢 Publicidad Oficial", callback_data: "publicidad" }],
        [{ text: "📈 Estado de Liquidez", callback_data: "liquidez" }],
        [{ text: "📜 Contratos", callback_data: "contratos" }]
      ]
    }
  });

  bot.sendMessage(chatId, publicidadInicial);
});

// --- Comando /info ---
bot.onText(/^\/info$/, (msg) => {
  const text = `📊 ${info.tokenName} (${info.symbol})
• Supply: ${info.supply}
• Decimals: ${info.decimals}

🔗 Contratos:
• Ethereum: ${info.contracts?.ethereum?.doaTokenV2 || "No definido"}
  Explorer: ${info.contracts?.ethereum?.explorerUrl || "No definido"}

• Polygon: ${info.contracts?.polygon?.doaTokenV2 || "No definido"}
  Explorer: ${info.contracts?.polygon?.explorerUrl || "No definido"}

• NFT: ${info.contracts?.nft?.join(", ") || "No definido"}
`;
  bot.sendMessage(msg.chat.id, text);
});

// --- Comando /links ---
bot.onText(/^\/links$/, (msg) => {
  const links = info.links
    ? Object.entries(info.links).map(([k, v]) => `• ${k}: ${v}`).join('\n')
    : "No hay enlaces configurados.";
  bot.sendMessage(msg.chat.id, `🔗 Enlaces oficiales:\n${links}`);
});

// --- Comando /announce (solo admin, publica en canal y fija) ---
bot.onText(/^\/announce (.+)$/, (msg, match) => {
  const username = msg.from.username;

  if (username !== ADMIN_USERNAME) {
    bot.sendMessage(msg.chat.id, "⛔ No tienes permisos para usar este comando.");
    return;
  }

  const announcement = match[1];

  bot.sendMessage(CHANNEL_ID, `📢 Anuncio oficial:\n${announcement}`)
    .then((sentMessage) => {
      try {
        bot.pinChatMessage(CHANNEL_ID, sentMessage.message_id);
      } catch (err) {
        console.error("⚠️ No se pudo fijar el mensaje:", err.message);
      }
    });
});

// --- Comando /liquidez ---
bot.onText(/^\/liquidez$/, (msg) => {
  const text = `
💧 Estado de Liquidez de ${info.tokenName}:

• QuickSwap (DOA/USDC): ${info.links?.dexQuickSwap_DOA_USDC || "No definido"}
• Uniswap (DOA/USDC): ${info.links?.dexUniswap_DOA_USDC || "No definido"}

• QuickSwap (DOA/WMATIC): ${info.links?.dexQuickSwap_DOA_WMATIC || "No definido"}
• Uniswap (DOA/WMATIC): ${info.links?.dexUniswap_DOA_WMATIC || "No definido"}

📊 Reservas mínimas configuradas: 50,000 USDC
🔔 Alertas activas si baja de ese umbral
`;
  bot.sendMessage(msg.chat.id, text);
});

// --- Manejo de botones ---
bot.on("callback_query", (query) => {
  const chatId = query.message.chat.id;

  if (query.data === "info") {
    const text = `📊 ${info.tokenName} (${info.symbol})
• Supply: ${info.supply}
• Decimals: ${info.decimals}

🔗 Contratos:
• Ethereum: ${info.contracts?.ethereum?.doaTokenV2 || "No definido"}
  Explorer: ${info.contracts?.ethereum?.explorerUrl || "No definido"}

• Polygon: ${info.contracts?.polygon?.doaTokenV2 || "No definido"}
  Explorer: ${info.contracts?.polygon?.explorerUrl || "No definido"}

• NFT: ${info.contracts?.nft?.join(", ") || "No definido"}
`;
    bot.sendMessage(chatId, text);
  }

  if (query.data === "links") {
    const links = info.links
      ? Object.entries(info.links).map(([k, v]) => `• ${k}: ${v}`).join("\n")
      : "No hay enlaces configurados.";
    bot.sendMessage(chatId, `🔗 Enlaces oficiales:\n${links}`);
  }

  if (query.data === "publicidad") {
    const publicidad = `
📢 Anuncio oficial:
🔥 Únete a la revolución DeFi con ${info.tokenName}: liquidez estable, transparencia total y comunidad en crecimiento.
    `;
    bot.sendMessage(chatId, publicidad);
  }

  if (query.data === "liquidez") {
    const text = `
💧 Estado de Liquidez de ${info.tokenName}:

• QuickSwap (DOA/USDC): ${info.links?.dexQuickSwap_DOA_USDC || "No definido"}
• Uniswap (DOA/USDC): ${info.links?.dexUniswap_DOA_USDC || "No definido"}

• QuickSwap (DOA/WMATIC): ${info.links?.dexQuickSwap_DOA_WMATIC || "No definido"}
• Uniswap (DOA/WMATIC): ${info.links?.dexUniswap_DOA_WMATIC || "No definido"}

📊 Reservas mínimas configuradas: 50,000 USDC
🔔 Alertas activas si baja de ese umbral
`;
    bot.sendMessage(chatId, text);
  }

  if (query.data === "contratos") {
    const contratos = `
📜 Contratos oficiales de ${info.tokenName}:

• Ethereum: ${info.contracts?.ethereum?.doaTokenV2 || "No definido"}
  Explorer: ${info.contracts?.ethereum?.explorerUrl || "No definido"}

• Polygon: ${info.contracts?.polygon?.doaTokenV2 || "No definido"}
  Explorer: ${info.contracts?.polygon?.explorerUrl || "No definido"}

• NFT: ${info.contracts?.nft?.join(", ") || "No definido"}
`;
    bot.sendMessage(chatId, contratos);
  }

  bot.answerCallbackQuery(query.id, { text: "✅ Acción recibida" });
});

// --- Verificación de permisos con auditoría ---
async function verificarPermisos(channelId) {
  try {
    const chat = await bot.getChat(channelId);
    const admins = await bot.getChatAdministrators(channelId);
    const botInfo = await bot.getMe();

    const esAdmin = admins.some(admin => admin.user.id === botInfo.id);

    const resultado = {
      canal: chat.title || chat.username || chat.id,
      channelId: channelId,
      bot: botInfo.username,
      esAdmin: esAdmin,
      fecha: new Date().toISOString()
    };

    console.log("✅ Canal detectado:", resultado.canal);
    if (esAdmin) {
      console.log("🔐 El bot tiene permisos de administrador en el canal.");
    } else {
      console.error("⛔ El bot NO es administrador en el canal. Dale permisos de publicar mensajes.");
    }

    const logsDir = path.join(__dirname, 'logs');
    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir);
    }
    const logPath = path.join(logsDir, 'permisos.json');
    fs.writeFileSync(logPath, JSON.stringify(resultado, null, 2));

  } catch (err) {
    console.error("❌ Error al verificar permisos:", err.message);
  }
}

// --- Prueba automática de publicación al iniciar ---
async function pruebaPublicacion() {
  try {
    const botInfo = await bot.getMe();
    console.log(`🤖 Bot conectado: ${botInfo.username}`);

    const sentMessage = await bot.sendMessage(CHANNEL_ID, "📢 Prueba de publicación desde DOATokenV2bot");
    console.log(`✅ Mensaje publicado en el canal (ID: ${CHANNEL_ID}), mensaje_id: ${sentMessage.message_id}`);
  } catch (err) {
    console.error("⛔ Error al publicar en el canal:", err.message);
    console.error("👉 Verifica que el bot sea administrador y que el CHANNEL_ID sea correcto.");
  }
}

// --- Llamadas iniciales al arrancar el bot ---
verificarPermisos(CHANNEL_ID);
pruebaPublicacion();
