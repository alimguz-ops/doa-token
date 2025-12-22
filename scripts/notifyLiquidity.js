import fs from "fs";
import fetch from "node-fetch";

const configPath = new URL("../config/polygon-mainnet.json", import.meta.url);
const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));

// Webhooks (reemplaza con los tuyos)
const slackWebhook = "https://hooks.slack.com/services/TU/WEBHOOK/URL";
const discordWebhook = "https://discord.com/api/webhooks/TU/WEBHOOK/URL";

// Mensaje enriquecido
function buildMessage(eventType, details) {
  return {
    text: `🔔 Liquidez ${eventType} en QuickSwap`,
    attachments: [
      {
        color: eventType === "añadida" ? "#36a64f" : "#ff0000",
        fields: [
          { title: "Token", value: config.token.address, short: true },
          { title: "Base", value: config.liquidity.baseToken, short: true },
          { title: "Pair", value: config.liquidity.pairAddress || "N/A", short: false },
          { title: "Detalles", value: JSON.stringify(details, null, 2), short: false },
          { title: "Trading", value: `https://quickswap.exchange/#/swap?inputCurrency=${config.token.address}&outputCurrency=${config.liquidity.baseToken}`, short: false }
        ]
      }
    ]
  };
}

// Enviar a Slack
async function notifySlack(eventType, details) {
  const msg = buildMessage(eventType, details);
  await fetch(slackWebhook, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(msg)
  });
  console.log("✅ Notificación enviada a Slack");
}

// Enviar a Discord
async function notifyDiscord(eventType, details) {
  const embed = {
    username: "LiquidityBot",
    embeds: [
      {
        title: `🔔 Liquidez ${eventType}`,
        color: eventType === "añadida" ? 3066993 : 15158332,
        fields: [
          { name: "Token", value: config.token.address, inline: true },
          { name: "Base", value: config.liquidity.baseToken, inline: true },
          { name: "Pair", value: config.liquidity.pairAddress || "N/A", inline: false },
          { name: "Detalles", value: "```" + JSON.stringify(details, null, 2) + "```", inline: false },
          { name: "Trading", value: `[QuickSwap Link](https://quickswap.exchange/#/swap?inputCurrency=${config.token.address}&outputCurrency=${config.liquidity.baseToken})`, inline: false }
        ]
      }
    ]
  };

  await fetch(discordWebhook, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(embed)
  });
  console.log("✅ Notificación enviada a Discord");
}

// Ejemplo de uso
async function main() {
  const details = {
    amountToken: config.liquidity.liqTokenAmount,
    amountBase: config.liquidity.liqBaseAmount,
    owner: config.token.owner
  };

  await notifySlack("añadida", details);
  await notifyDiscord("añadida", details);
}

main().catch(console.error);
