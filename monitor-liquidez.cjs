/**
 * Monitor de liquidez DOA/WPOL (Polygon) + DOA/WETH (Ethereum)
 * + Gráfica conjunta + Resumen Telegram + Discord + Airdrops de fidelidad
 */

// Ignorar warnings deprecados en consola
process.emitWarning = (msg, type) => {
  if (type === 'DeprecationWarning') return;
  console.warn(msg);
};

const fs = require("fs");
const dotenv = require("dotenv");
const { ethers } = require("ethers");
const { ChartJSNodeCanvas } = require("chartjs-node-canvas");
const fetch = require("node-fetch");
const FormData = require("form-data");

dotenv.config();

// --- Configuración ---
const RPC_URL = process.env.POLYGON_RPC;
const ETH_RPC = process.env.ETH_RPC || "";
const LOG_FILE = process.env.LOG_FILE || "./deployments/liquidity.log";
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;
const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL;
const DOA_TOKEN_ADDR = process.env.CONTRACT_ADDRESS;
const AIRDROP_AMOUNT = ethers.parseUnits(process.env.AIRDROP_AMOUNT || "10", 18);

// Direcciones de pares desde .env
const PAIR_ADDR_POLYGON = process.env.PAIR_ADDR;
const PAIR_ADDR_ETHEREUM = process.env.PAIR_ADDR_ETHEREUM || process.env.PAIR_ADDRESS;

// Providers
const providerPolygon = new ethers.JsonRpcProvider(RPC_URL);
const providerEth = ETH_RPC ? new ethers.JsonRpcProvider(ETH_RPC) : null;

// ABI
const pairAbi = [
  "function getReserves() view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast)",
  "function token0() view returns (address)",
  "function token1() view returns (address)"
];
const erc20Abi = [
  "function balanceOf(address) view returns (uint256)",
  "function transfer(address,uint256) returns (bool)"
];

// --- Log ---
function logEvent(message) {
  const timestamp = new Date().toISOString();
  const entry = `[${timestamp}] ${message}`;
  console.log(entry);
  if (!fs.existsSync("./deployments")) fs.mkdirSync("./deployments", { recursive: true });
  fs.appendFileSync(LOG_FILE, entry + "\n");
}

// --- Utilidades ---
function ensureHistory(file) {
  if (!fs.existsSync("./deployments")) fs.mkdirSync("./deployments", { recursive: true });
  if (!fs.existsSync(file)) fs.writeFileSync(file, JSON.stringify([], null, 2));
}

// --- Monitor Polygon ---
async function checkLiquidityPolygon() {
  try {
    if (!PAIR_ADDR_POLYGON) {
      logEvent("⚠️ [Polygon] Dirección de par inválida");
      return null;
    }
    const pair = new ethers.Contract(PAIR_ADDR_POLYGON, pairAbi, providerPolygon);
    const { reserve0, reserve1 } = await pair.getReserves();
    const res0 = Number(ethers.formatUnits(reserve0, 18));
    const res1 = Number(ethers.formatUnits(reserve1, 18));
    logEvent(`📊 [Polygon] Reservas: ${res0} / ${res1}`);
    const historyFile = "./deployments/liquidity-history-polygon.json";
    ensureHistory(historyFile);
    const history = JSON.parse(fs.readFileSync(historyFile));
    history.push({ time: new Date().toLocaleString(), reserve0: res0, reserve1: res1 });
    if (history.length > 100) history.shift();
    fs.writeFileSync(historyFile, JSON.stringify(history, null, 2));
    return { reserve0: res0, reserve1: res1 };
  } catch (err) {
    logEvent(`❌ [Polygon] Error: ${err.message}`);
    return null;
  }
}

// --- Monitor Ethereum ---
async function checkLiquidityEthereum() {
  try {
    if (!providerEth || !PAIR_ADDR_ETHEREUM) {
      logEvent("⚠️ [Ethereum] Dirección de par inválida");
      return null;
    }
    const pair = new ethers.Contract(PAIR_ADDR_ETHEREUM, pairAbi, providerEth);
    const { reserve0, reserve1 } = await pair.getReserves();
    const res0 = Number(ethers.formatUnits(reserve0, 18));
    const res1 = Number(ethers.formatUnits(reserve1, 18));
    logEvent(`📊 [Ethereum] Reservas: ${res0} / ${res1}`);
    const historyFile = "./deployments/liquidity-history-ethereum.json";
    ensureHistory(historyFile);
    const history = JSON.parse(fs.readFileSync(historyFile));
    history.push({ time: new Date().toLocaleString(), reserve0: res0, reserve1: res1 });
    if (history.length > 100) history.shift();
    fs.writeFileSync(historyFile, JSON.stringify(history, null, 2));
    return { reserve0: res0, reserve1: res1 };
  } catch (err) {
    logEvent(`❌ [Ethereum] Error: ${err.message}`);
    return null;
  }
}

// --- Gráfica conjunta ---
async function generateCombinedChart(outputFile) {
  const width = 800;
  const height = 400;
  const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height });
  const polyHistory = JSON.parse(fs.readFileSync("./deployments/liquidity-history-polygon.json"));
  const ethHistory = JSON.parse(fs.readFileSync("./deployments/liquidity-history-ethereum.json"));
  const labels = polyHistory.map(h => h.time);
  const dataPoly = polyHistory.map(h => h.reserve1);
  const dataEth = ethHistory.map(h => h.reserve1);
  const configuration = {
    type: "line",
    data: {
      labels,
      datasets: [
        { label: "Reservas DOA (Polygon)", data: dataPoly, borderColor: "rgba(255,0,0,1)", fill: false },
        { label: "Reservas DOA (Ethereum)", data: dataEth, borderColor: "rgba(0,0,255,1)", fill: false }
      ]
    },
    options: { plugins: { title: { display: true, text: "Liquidez DOA en Polygon + Ethereum" } } }
  };
  const image = await chartJSNodeCanvas.renderToBuffer(configuration);
  fs.writeFileSync(outputFile, image);
  logEvent(`✅ Gráfica conjunta generada: ${outputFile}`);
}

// --- Telegram ---
async function sendTelegramText(text) {
  const urlMsg = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
  const res = await fetch(urlMsg, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: TELEGRAM_CHAT_ID,
      text,
      parse_mode: "MarkdownV2"
    })
  });
  const data = await res.json();
  logEvent(`📨 Telegram respuesta (texto): ${JSON.stringify(data)}`);
}

async function sendTelegramPhoto(filePath, caption) {
  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendPhoto`;
  const formData = new FormData();
  formData.append("chat_id", TELEGRAM_CHAT_ID);
  formData.append("caption", caption);
  formData.append("photo", fs.createReadStream(filePath));
  const res = await fetch(url, { method: "POST", body: formData });
  const data = await res.json();
  logEvent(`📨 Telegram respuesta (foto): ${JSON.stringify(data)}`);
}

// --- Discord ---
async function sendDiscordMessage(content) {
  if (!DISCORD_WEBHOOK_URL) {
    logEvent("⚠️ Discord webhook no configurado");
    return;
  }
  try {
    await fetch(DISCORD_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content })
    });
    logEvent("📨 Mensaje enviado a Discord");
  } catch (err) {
    logEvent(`❌ Error enviando a Discord: ${err.message}`);
  }
}

// --- Airdrop de fidelidad ---
async function runAirdrop(activeUsers) {
  if (!DOA_TOKEN_ADDR || !process.env.PRIVATE_KEY) {
    logEvent("⚠️ Airdrop no configurado");
    return;
  }
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, providerPolygon);
  const doaToken = new ethers.Contract(DOA_TOKEN_ADDR, erc20Abi, wallet);
  for (const user of activeUsers) {
    try {
      const tx = await doaToken.transfer(user, AIRDROP_AMOUNT);
      logEvent(`🎁 Airdrop enviado a ${user}: ${ethers.formatUnits(AIRDROP_AMOUNT, 18)} DOA`);
      await tx.wait();
    } catch (err) {
      logEvent(`❌ Error enviando airdrop a ${user}: ${err.message}`);
    }
  }
}

// --- Inicio ---
(async () => {
  logEvent("🚀 Monitor de liquidez iniciado...");
  if (process.env.MONITOR_ENABLED === "true") {
    const polyRes = await checkLiquidityPolygon();
    const ethRes = await checkLiquidityEthereum();
    await generateCombinedChart("./deployments/chart-combined.png");

   // --- Discord Bloques elegantes con embeds ---
if (polyRes) {
  await fetch(DISCORD_WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      embeds: [{
        title: "🔴 Monitor de Liquidez [Polygon]",
        description: `Token0 (WMATIC): ${polyRes.reserve0}\nToken1 (DOA): ${polyRes.reserve1}\n\nDOA Token V2 • ${new Date().toLocaleString()}`,
        color: 15158332 // rojo
      }]
    })
  });
}

if (ethRes) {
  await fetch(DISCORD_WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      embeds: [{
        title: "🔵 Monitor de Liquidez [Ethereum]",
        description: `Token0 (DOA): ${ethRes.reserve0}\nToken1 (WETH): ${ethRes.reserve1}\n\nDOA Token V2 • ${new Date().toLocaleString()}`,
        color: 3447003 // azul
      }]
    })
  });
}

// --- Publicidad institucional en Discord ---
await fetch(DISCORD_WEBHOOK_URL, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    embeds: [{
      title: "📢 Publicidad institucional",
      description: "🌐 Visita: [doatoken.org](https://doatoken.org/)\n\n🤝 Participa en Discord para unirte al canal de Telegram\nDOA Token V2 – Transparencia, liquidez y recompensas automáticas",
      color: 8359053 // gris
    }]
  })
});

// --- Evolución conjunta ---
await fetch(DISCORD_WEBHOOK_URL, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    embeds: [{
      title: "📊 Evolución conjunta Polygon + Ethereum",
      description: "🌐 Más información en [doatoken.org](https://doatoken.org)\nRecuerda: la comunidad DOA se organiza en Discord, ¡y desde allí puedes unirte al canal de Telegram!",
      color: 9807270 // gris oscuro
    }]
  })
});

    // --- Telegram Bloques separados con MarkdownV2 ---
    if (polyRes) {
      const polyBlock = `
🔴 *Monitor de Liquidez \

\[Polygon\\]

*
━━━━━━━━━━━━━━━━━━━━━━
Token0 \\(WMATIC\\): ${polyRes.reserve0}
Token1 \\(DOA\\): ${polyRes.reserve1}

*DOA Token V2* • ${new Date().toLocaleString()}
`;
      await sendTelegramText(polyBlock);
    }

    if (ethRes) {
      const ethBlock = `
🔵 *Monitor de Liquidez \

\[Ethereum\\]

*
━━━━━━━━━━━━━━━━━━━━━━
Token0 \\(DOA\\): ${ethRes.reserve0}
Token1 \\(WETH\\): ${ethRes.reserve1}

*DOA Token V2* • ${new Date().toLocaleString()}
`;
      await sendTelegramText(ethBlock);
    }

    await sendTelegramPhoto(
      "./deployments/chart-combined.png",
      "📊 Evolución conjunta Polygon + Ethereum\n\n🌐 Más información en [doatoken\\.org](https://doatoken.org)\nRecuerda: la comunidad DOA se organiza en Discord, ¡y desde allí puedes unirte al canal de Telegram!"
    );

    // --- Airdrops iniciales ---
    const activeUsers = (process.env.ACTIVE_USERS || "").split(",").filter(Boolean);
    if (activeUsers.length > 0) {
      await runAirdrop(activeUsers);
    }

    // --- Intervalos ---
    setInterval(checkLiquidityPolygon, process.env.CHECK_INTERVAL || 3600000);
    setInterval(checkLiquidityEthereum, process.env.CHECK_INTERVAL || 3600000);

    // Gráficas cada 12h
    setInterval(async () => {
      await generateCombinedChart("./deployments/chart-combined.png");
      await sendTelegramPhoto(
        "./deployments/chart-combined.png",
        "📊 Actualización de gráficas de liquidez DOA\n\n🌐 [doatoken\\.org](https://doatoken.org)\nParticipa en Discord y únete al canal de Telegram"
      );
      await sendDiscordMessage(`
\`\`\`fix
📊 Actualización de gráficas de liquidez DOA
🌐 https://doatoken.org
Únete en Discord para acceder al canal de Telegram.
\`\`\`
`);
    }, 43200000);

    // Airdrops cada 24h
    setInterval(() => {
      const activeUsers = (process.env.ACTIVE_USERS || "").split(",").filter(Boolean);
      if (activeUsers.length > 0) {
        runAirdrop(activeUsers);
      }
    }, 86400000);
  }
})();
