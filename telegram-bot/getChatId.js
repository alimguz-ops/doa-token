require('dotenv').config();
const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');

const TOKEN = process.env.BOT_TOKEN;
if (!TOKEN) {
  console.error("❌ BOT_TOKEN no definido en .env");
  process.exit(1);
}

async function getChatId() {
  try {
    const res = await fetch(`https://api.telegram.org/bot${TOKEN}/getUpdates`);
    const data = await res.json();

    if (!data.ok || data.result.length === 0) {
      console.error("⚠️ No hay actualizaciones. Envía un mensaje al canal/grupo primero.");
      return;
    }

    const lastUpdate = data.result[data.result.length - 1];
    const chatId = lastUpdate.message.chat.id;

    console.log("✅ Chat ID encontrado:", chatId);

    const configPath = path.join(__dirname, "config", "chat.json");
    fs.writeFileSync(configPath, JSON.stringify({ chatId }, null, 2));

    console.log(`💾 Chat ID guardado en ${configPath}`);
  } catch (err) {
    console.error("❌ Error al obtener chat_id:", err.message);
  }
}

getChatId();