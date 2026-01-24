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
const PAIR_ADDR = process.env.PAIR_ADDR || process.env.PAIR_ADDR_POLYGON; // respeta tu variable original
const MIN_RESERVES = Number(process.env.MIN_RESERVES || 1000);
const LOG_FILE = process.env.LOG_FILE || "./deployments/liquidity.log";
const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL;
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

// --- Soporte opcional para Ethereum (solo si está definido) ---
const ETH_RPC = process.env.ETH_RPC || "";
const PAIR_ADDR_ETHEREUM = process.env.PAIR_ADDR_ETHEREUM || "";

// Node >=18 trae fetch global
const fetchFn = globalThis.fetch || undefined;

// Provider principal (Polygon, como antes)
const provider = new ethers.JsonRpcProvider(RPC_URL);

// Provider opcional (Ethereum)
const providerEth = ETH_RPC ? new ethers.JsonRpcProvider(ETH_RPC) : null;

const pairAbi = [
  "function getReserves() view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast)",
  "function token0() view returns (address)",
  "function token1() view returns (address)"
];

const erc20Abi = [
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)"
];

// --- Log + Discord (formato original) ---
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
          title: "📊 Monitor de Liquidez DOA/WPOL",
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

// --- Consulta de liquidez (Polygon, flujo original) ---
async function checkLiquidityPolygon() {
  try {
    if (!isValidAddress(PAIR_ADDR)) {
      logEvent("⚠️ Dirección de par inválida o no definida en .env (Polygon)");
      return;
    }

    const pair = new ethers.Contract(PAIR_ADDR, pairAbi, provider);
    const { reserve0, reserve1 } = await pair.getReserves();
    const token0 = await pair.token0();
    const token1 = await pair.token1();

    // Mantener 18 decimales como en tu script original
    const res0 = Number(ethers.formatUnits(reserve0, 18));
    const res1 = Number(ethers.formatUnits(reserve1, 18));

    logEvent("Estado del pool actualizado", {
      description: "📊 Liquidez actual en QuickSwap (Polygon)",
      color: 3447003,
      fields: [
        { name: `Token0 (${token0})`, value: `${res0}`, inline: true },
        { name: `Token1 (${token1})`, value: `${res1}`, inline: true }
      ]
    });

    if (res1 < MIN_RESERVES) {
      logEvent(`⚠️ ALERTA: Reservas bajas (${res1} DOA)`, {
        description: `⚠️ Reservas de DOA por debajo del mínimo (${MIN_RESERVES})`,
        color: 15158332
      });
    } else {
      logEvent(`✅ OK: Reservas actuales ${res1} DOA`, {
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
    logEvent(`❌ Error al consultar reservas: ${err.message}`, {
      description: "❌ Fallo en la consulta de liquidez (Polygon)",
      color: 15158332
    });
  }
}

// --- Consulta de liquidez (Ethereum, opcional y no intrusiva) ---
async function checkLiquidityEthereum() {
  try {
    if (!providerEth || !isValidAddress(PAIR_ADDR_ETHEREUM)) {
      // No romper: si no hay par en ETH, simplemente no se consulta
      return;
    }

    const pair = new ethers.Contract(PAIR_ADDR_ETHEREUM, pairAbi, providerEth);
    const { reserve0, reserve1 } = await pair.getReserves();
    const token0 = await pair.token0();
    const token1 = await pair.token1();

    const res0 = Number(ethers.formatUnits(reserve0, 18));
    const res1 = Number(ethers.formatUnits(reserve1, 18));

    // Log separado para ETH, pero sin cambiar el formato original de Polygon
    logEvent("Estado del pool actualizado (Ethereum)", {
      description: "📊 Liquidez actual en Uniswap (Ethereum)",
      color: 3447003,
      fields: [
        { name: `Token0 (${token0})`, value: `${res0}`, inline: true },
        { name: `Token1 (${token1})`, value: `${res1}`, inline: true }
      ]
    });

    const historyFile = "./deployments/liquidity-history-ethereum.json";
    ensureHistory(historyFile);
    const history = JSON.parse(fs.readFileSync(historyFile));
    history.push({ time: new Date().toLocaleString(), reserve0: res0, reserve1: res1 });
    if (history.length > 100) history.shift();
    fs.writeFileSync(historyFile, JSON.stringify(history, null, 2));

  } catch (err) {
    logEvent(`❌ Error al consultar reservas (Ethereum): ${err.message}`, {
      description: "❌ Fallo en la consulta de liquidez (Ethereum)",
      color: 15158332
    });
  }
}

// --- Resumen a Telegram (mantener formato original) ---
async function sendTelegramSummaryPolygon() {
  try {
    const historyFile = "./deployments/liquidity-history-polygon.json";
    ensureHistory(historyFile);
    let history = JSON.parse(fs.readFileSync(historyFile));

    if (history.length === 0) {
      // Evitar fallo cuando aún no hay datos
      logEvent("ℹ️ No hay datos de liquidez aún (Polygon).");
      return;
    }

    const labels = history.map(h => h.time);
    const valuesDOA = history.map(h => h.reserve1);
    const valuesWMATIC = history.map(h => h.reserve0);

    const chartUrl = `https://quickchart.io/chart?c=${encodeURIComponent(JSON.stringify({
      type: 'line',
      data: {
        labels,
        datasets: [
          { label: 'Reservas DOA', data: valuesDOA, borderColor: 'green', backgroundColor: 'rgba(0,255,0,0.2)', fill: true },
          { label: 'Reservas WMATIC/WPOL', data: valuesWMATIC, borderColor: 'blue', backgroundColor: 'rgba(0,0,255,0.2)', fill: true }
        ]
      },
      options: { title: { display: true, text: '📈 Evolución de Reservas DOA/WPOL' } }
    }))}`;

    const last = history[history.length - 1];
    const summary = `*📊 Resumen de Liquidez DOA/WPOL*\n\n*Último registro:*\n🔹 Token0 → *${last.reserve0}*\n🔹 Token1 → *${last.reserve1}*\n🕒 ${last.time}`;

    if (TELEGRAM_BOT_TOKEN && TELEGRAM_CHAT_ID && fetchFn) {
      const urlMsg = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
      await fetchFn(urlMsg, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text: summary, parse_mode: "Markdown" })
      });

      const urlPhoto = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendPhoto`;
      await fetchFn(urlPhoto, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, photo: chartUrl, caption: "📈 Evolución de reservas DOA y WMATIC/WPOL" })
      });

      console.log("✅ Resumen + gráfico enviado a Telegram");
    }
  } catch (err) {
    console.error("❌ Error enviando a Telegram (Polygon):", err.message);
  }
}

// --- Inicio (mantener tu secuencia original) ---
logEvent("🚀 Monitor de liquidez iniciado...");

if (process.env.MONITOR_ENABLED === "true") {
  logEvent("🚀 Monitor de liquidez activado...");

  // Polygon (como antes)
  checkLiquidityPolygon();
  sendTelegramSummaryPolygon();

  // Ethereum (solo si está configurado; no interfiere con Polygon)
  checkLiquidityEthereum();

  setInterval(checkLiquidityPolygon, 3600000);        // cada hora
  setInterval(sendTelegramSummaryPolygon, 43200000);  // cada 12h

  // Consulta ETH cada hora si está configurado
  if (providerEth && isValidAddress(PAIR_ADDR_ETHEREUM)) {
    setInterval(checkLiquidityEthereum, 3600000);
  }
}
