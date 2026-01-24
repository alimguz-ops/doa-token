// scripts/validateTokenList.js
import fs from "fs";
import path from "path";
import Ajv from "ajv";
import { ethers } from "ethers";

async function main() {
  const ajv = new Ajv({ allErrors: true });

  // Esquema oficial de Uniswap Token Lists
  const schema = {
    type: "object",
    properties: {
      name: { type: "string" },
      logoURI: { type: "string" },
      timestamp: { type: "string" },
      tokens: {
        type: "array",
        items: {
          type: "object",
          properties: {
            chainId: { type: "number" },
            address: { type: "string" },
            symbol: { type: "string" },
            name: { type: "string" },
            decimals: { type: "number" },
            logoURI: { type: "string" }
          },
          required: ["chainId", "address", "symbol", "name", "decimals"]
        }
      }
    },
    required: ["name", "tokens"]
  };

  const validate = ajv.compile(schema);

  // Ruta del archivo
  const filePath = path.join(process.cwd(), "tokenlist", "doa-tokenlist.json");

  if (!fs.existsSync(filePath)) {
    console.error("❌ No existe tokenlist/doa-tokenlist.json");
    process.exit(1);
  }

  let data;
  try {
    data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  } catch (err) {
    console.error("❌ Error parseando tokenlist:", err.message);
    process.exit(1);
  }

  const valid = validate(data);
  if (!valid) {
    console.error("❌ Errores de validación:");
    console.error(validate.errors);
    process.exit(1);
  }

  // Limpieza adicional
  let corrections = 0;
  data.tokens = data.tokens.map(token => {
    if (token.chainId !== 137) {
      console.warn(`⚠️ Corrigiendo chainId para ${token.symbol}`);
      token.chainId = 137;
      corrections++;
    }
    if (!ethers.isAddress(token.address) ||
        token.address.toLowerCase() !== "0x692d951163df3f7d9fe071413f92c319d9b7369e") {
      console.warn(`⚠️ Corrigiendo address para ${token.symbol}`);
      token.address = "0x692d951163df3f7D9Fe071413F92c319D9B7369E";
      corrections++;
    }
    try {
      new URL(token.logoURI);
    } catch {
      console.warn(`⚠️ Corrigiendo logoURI para ${token.symbol}`);
      token.logoURI = "https://raw.githubusercontent.com/alimguz-ops/doa-token/main/assets/doa-logo.png";
      corrections++;
    }
    return token;
  });

  // Actualizar timestamp
  data.timestamp = new Date().toISOString();

  // Guardar archivo limpio
  const cleanPath = path.join(process.cwd(), "tokenlist", "doa-tokenlist-clean.json");
  try {
    fs.writeFileSync(cleanPath, JSON.stringify(data, null, 2));
    console.log(`✅ tokenlist validado y limpio. Correcciones aplicadas: ${corrections}. Archivo listo: ${cleanPath}`);
  } catch (err) {
    console.error("❌ Error escribiendo tokenlist limpio:", err.message);
  }
}

main();