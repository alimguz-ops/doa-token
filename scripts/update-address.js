// scripts/update-address.js
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { ethers } from "ethers";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 1. Obtener direcciones desde argumentos o variables de entorno
const ethAddress = process.argv[2] || process.env.ETH_CONTRACT;
const polygonAddress = process.argv[3] || process.env.POLYGON_CONTRACT;

if (!ethAddress || !polygonAddress) {
  console.error("❌ Faltan direcciones de contrato.");
  console.error("Usa: node scripts/update-address.js <ETH_ADDRESS> <POLYGON_ADDRESS>");
  console.error("O define ETH_CONTRACT y POLYGON_CONTRACT en variables de entorno.");
  process.exit(1);
}

// Validar formato de direcciones
if (!ethers.isAddress(ethAddress)) {
  console.error("❌ Dirección Ethereum inválida:", ethAddress);
  process.exit(1);
}
if (!ethers.isAddress(polygonAddress)) {
  console.error("❌ Dirección Polygon inválida:", polygonAddress);
  process.exit(1);
}

// 2. Rutas de archivos
const tokenlistPath = path.join(__dirname, "../tokenlists/doa-tokenlist.json");
const deploymentsPath = path.join(__dirname, "../deployments.json");
const readmePath = path.join(__dirname, "../README.md");

// 3. Actualizar tokenlist.json (ejemplo: primer token = Polygon, segundo = Ethereum)
try {
  const tokenlist = JSON.parse(fs.readFileSync(tokenlistPath, "utf8"));
  if (Array.isArray(tokenlist.tokens)) {
    if (tokenlist.tokens[0]) tokenlist.tokens[0].address = polygonAddress;
    if (tokenlist.tokens[1]) tokenlist.tokens[1].address = ethAddress;
    fs.writeFileSync(tokenlistPath, JSON.stringify(tokenlist, null, 2));
    console.log("✅ Tokenlist actualizado con ambas direcciones");
  } else {
    console.warn("⚠️ No se encontró arreglo tokens en tokenlist.json");
  }
} catch (err) {
  console.error("❌ Error actualizando tokenlist:", err.message);
  process.exit(1);
}

// 4. Actualizar deployments.json con ambas redes
try {
  let deployments = {};
  if (fs.existsSync(deploymentsPath)) {
    deployments = JSON.parse(fs.readFileSync(deploymentsPath, "utf8"));
  }
  deployments.ethereum = ethAddress;
  deployments.polygon = polygonAddress;
  deployments.updatedAt = new Date().toISOString();
  fs.writeFileSync(deploymentsPath, JSON.stringify(deployments, null, 2));
  console.log("✅ deployments.json actualizado con Ethereum y Polygon");
} catch (err) {
  console.error("❌ Error actualizando deployments.json:", err.message);
  process.exit(1);
}

// 5. Actualizar README.md con ambas direcciones
try {
  let readme = fs.readFileSync(readmePath, "utf8");
  const regexEth = /Contrato \(Ethereum\): .*/g;
  const regexPolygon = /Contrato \(Polygon\): .*/g;

  if (regexEth.test(readme)) {
    readme = readme.replace(regexEth, `Contrato (Ethereum): ${ethAddress}`);
  } else {
    readme = `${readme.trim()}\n\nContrato (Ethereum): ${ethAddress}`;
  }

  if (regexPolygon.test(readme)) {
    readme = readme.replace(regexPolygon, `Contrato (Polygon): ${polygonAddress}`);
  } else {
    readme = `${readme.trim()}\n\nContrato (Polygon): ${polygonAddress}`;
  }

  fs.writeFileSync(readmePath, readme);
  console.log("✅ README.md actualizado con ambas direcciones");
} catch (err) {
  console.error("❌ Error actualizando README.md:", err.message);
  process.exit(1);
}

console.log(`🕒 Actualizado en: ${new Date().toISOString()}`);
