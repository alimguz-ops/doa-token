/**
 * Monitor de liquidez DOA/WPOL (Polygon) + soporte opcional DOA/WETH (Ethereum)
 * - Mantiene el comportamiento original en Polygon
 * - Añade Ethereum solo si PAIR_ADDR_ETHEREUM está definido
 * - No modifica .env; se adapta a lo que haya
 */

const fs = require("fs");
const dotenv = require("dotenv");
const { ethers } = require("ethers");

dotenv.config();

// --- Compatibilidad con tu flujo original ---
const RPC_URL = process.env.POLYGON_RPC || "https://polygon-rpc.com";
const PAIR_ADDR = process.env.PAIR_ADDR || process.env.PAIR_ADDR_POLYGON;
const MIN_RESERVES = Number(process.env.MIN_RESERVES || 1000);
const LOG_FILE = process.env.LOG_FILE || "./deployments/liquidity.log";
const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL;
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

// --- Soporte opcional para Ethereum ---
const ETH_RPC = process.env.ETH_RPC || "";
const PAIR_ADDR_ETHEREUM = process.env.PAIR_ADDR_ETHEREUM || "";

// Node >=18 trae fetch global
const fetchFn = globalThis.fetch || undefined;

// Providers
const provider = new ethers.JsonRpcProvider(RPC_URL);
const providerEth = ETH_RPC ? new ethers.JsonRpcProvider(ETH_RPC) : null;

const pairAbi = [
  "function getReserves() view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast)",
  "function token0() view returns (address)",
  "function token1() view returns (address)"
];

// --- Log + Discord ---
function logEvent(message, embedOptions = {}) {
  const timestamp = new Date().toISOString();
  const entry = `[${timestamp}] ${message}`;
  console.log(entry);

  if (!fs.existsSync("./deployments")) {
    fs.mkdirSync("./deployments", { recursive: true });
  }
  fs.appendFileSync(LOG_FILE, entry + "\n");

  if (DISCORD_WEBHOOK_URL && fetchFn) {
    const embed = {
      embeds: [
        {
          title: embedOptions.title || "📊 Monitor de Liquidez",
          description: embedOptions.description || message,
          color: embedOptions.color || 3447003,
          fields: embedOptions.fields || [],
          timestamp,
          footer: { text: "DOA Token V2 - Liquidez Automática" }
        }
      ]
    };

    fetchFn(DISCORD_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(embed)
    }).catch(err => console.error("❌ Error Discord:", err.message));
  }
}

// --- Utilidades ---
function isValidAddress(addr) {
  try { return !!addr && ethers.isAddress(addr); } catch { return false; }
}
function ensureHistory(file) {
  if (!fs.existsSync("./deployments")) {
    fs.mkdirSync("./deployments", { recursive: true });
  }
  if (!fs.existsSync(file)) {
    fs.writeFileSync(file, JSON.stringify([], null, 2));
  }
}

// --- Consulta Polygon ---
async function checkLiquidityPolygon() {
  try {
    if (!isValidAddress(PAIR_ADDR)) {
      logEvent("⚠️ [Polygon] Dirección de par inválida o no definida en .env", { title: "📊 Monitor de Liquidez [Polygon]" });
      return;
    }

    const pair = new ethers.Contract(PAIR_ADDR, pairAbi, provider);
    const { reserve0, reserve1 } = await pair.getReserves();
    const token0 = await pair.token0();
    const token1 = await pair.token1();

    const res0 = Number(ethers.formatUnits(reserve0, 18));
    const res1 = Number(ethers.formatUnits(reserve1, 18));

    logEvent("📊 [Polygon] Estado del pool actualizado", {
      title: "📊 Monitor de Liquidez [Polygon]",
      description: "📊 Liquidez actual en QuickSwap (Polygon)",
      fields: [
        { name: `Token0 (${token0})`, value: `${res0}`, inline: true },
        { name: `Token1 (${token1})`, value: `${res1}`, inline: true }
      ]
    });

    if (res1 < MIN_RESERVES) {
      logEvent(`⚠️ [Polygon] Reservas bajas (${res1} DOA)`, {
        title: "📊 Monitor de Liquidez [Polygon]",
        description: `⚠️ Reservas de DOA por debajo del mínimo (${MIN_RESERVES})`,
        color: 15158332
      });
    } else {
      logEvent(`✅ [Polygon] Reservas actuales ${res1} DOA`, {
        title: "📊 Monitor de Liquidez [Polygon]",
        description: `✅ Reservas de DOA por encima del mínimo (${MIN_RESERVES})`,
        color: 3066993
      });
    }

    const historyFile = "./deployments/liquidity-history-polygon.json";
    ensureHistory(historyFile);
    const history = JSON.parse(fs.readFileSync(historyFile));
    history.push({ time: new Date().toLocaleString(), reserve0: res0, reserve1: res1 });
    if (history.length > 100) history.shift();
    fs.writeFileSync(historyFile, JSON.stringify(history, null, 2));

  } catch (err) {
    logEvent(`❌ [Polygon] Error al consultar reservas: ${err.message}`, {
      title: "📊 Monitor de Liquidez [Polygon]",
      description: "❌ Fallo en la consulta de liquidez (Polygon)",
      color: 15158332
    });
  }
}

// --- Consulta Ethereum ---
async function checkLiquidityEthereum() {
  try {
    if (!providerEth || !isValidAddress(PAIR_ADDR_ETHEREUM)) return;

    const pair = new ethers.Contract(PAIR_ADDR_ETHEREUM, pairAbi, providerEth);
    const { reserve0, reserve1 } = await pair.getReserves();
    const token0 = await pair.token0();
    const token1 = await pair.token1();

    const res0 = Number(ethers.formatUnits(reserve0, 18));
    const res1 = Number(ethers.formatUnits(reserve1, 18));

    logEvent("📊 [Ethereum] Estado del pool actualizado", {
      title: "📊 Monitor de Liquidez [Ethereum]",
      description: "📊 Liquidez actual en Uniswap (Ethereum)",
      fields: [
        { name: `Token0 (${token0})`, value: `${res0}`, inline: true },
        { name: `Token1 (${token1})`, value: `${res1}`, inline: true }
      ]
    });

    if (res1 < MIN_RESERVES) {
      logEvent(`⚠️ [Ethereum] Reservas bajas (${res1} DOA)`, {
        title: "📊 Monitor de Liquidez [Ethereum]",
        description: `⚠️ Reservas de DOA por debajo del mínimo (${MIN_RESERVES})`,
        color: 15158332
      });
    } else {
      logEvent(`✅ [Ethereum] Reservas actuales ${res1} DOA`, {
        title: "📊 Monitor de Liquidez [Ethereum]",
        description: `✅ Reservas de DOA por encima del mínimo (${MIN_RESERVES})`,
        color: 3066993
      });
    }

    const historyFile = "./deployments/liquidity-history-ethereum.json";
    ensureHistory(historyFile);
    const history = JSON.parse(fs.readFileSync(historyFile));
    history.push({ time: new Date().toLocaleString(), reserve0: res0, reserve1: res1 });
    if (history.length > 100) history.shift();
    fs.writeFileSync(historyFile, JSON.stringify(history, null, 2));

  } catch (err) {
    logEvent(`❌ [Ethereum] Error al consultar reservas: ${err.message}`, {
      title: "📊 Monitor de Liquidez [Ethereum]",
      description: "❌ Fallo en la consulta de liquidez (Ethereum)",
      color: 15158332
    });
  }
}

// --- Resumen unificado a Telegram ---
async function sendTelegramSummaryUnified() {
  try {
    // Polygon
    const polyFile = "./deployments/liquidity-history-polygon.json";
    ensureHistory(polyFile);
    const polyHistory = JSON.parse(fs.readFileSync(polyFile));
    const lastPoly = polyHistory[polyHistory.length - 1];

    // Ethereum
    const ethFile = "./deployments/liquidity-history-ethereum.json";
    ensureHistory(ethFile);
    const ethHistory = JSON.parse(fs.readFileSync(ethFile));
    const lastEth = ethHistory[ethHistory.length - 1];

    const summary = `*📊 Resumen de Liquidez DOA*\n\n` +
      `🔹 [Polygon] DOA/WPOL\nToken0 → *${lastPoly.reserve0}*\nToken1 → *${lastPoly.reserve1}*\n🕒 ${lastPoly.time}\n\n` +
      `🔹 [Ethereum] DOA/WETH\nToken0 → *${lastEth.reserve0}*\nToken1 → *${lastEth.reserve1}*\n🕒 ${lastEth.time}`;

    if (TELEGRAM_BOT_TOKEN && TELEGRAM_CHAT_ID && fetchFn) {
      const urlMsg = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
      await fetchFn(urlMsg, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text: summary, parse_mode: "Markdown" })
      });

      console.log("✅ Resumen unificado enviado a Telegram (Polygon + Ethereum)");
    }
  } catch (err) {
    console.error("❌ Error enviando resumen unificado:", err.message);
  }
}

// --- Inicio ---
logEvent("🚀 Monitor de liquidez iniciado...");

if (process.env.MONITOR_ENABLED === "true") {
  logEvent("🚀 Monitor de liquidez activado...");

  // Polygon
  checkLiquidityPolygon();

  // Ethereum (solo si está configurado)
  checkLiquidityEthereum();

  // Enviar resumen unificado
  sendTelegramSummaryUnified();

  // Intervalos
  setInterval(checkLiquidityPolygon, 3600000);        // cada hora
  setInterval(checkLiquidityEthereum, 3600000);       // cada hora (si ETH está configurado)
  setInterval(sendTelegramSummaryUnified, 43200000);  // cada 12h
}
