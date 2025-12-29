// scripts/update-address.js
const fs = require("fs");
const path = require("path");

// Dirección del contrato (se pasa como argumento al script)
const contractAddress = process.argv[2];
if (!contractAddress) {
  console.error("❌ Debes pasar la dirección del contrato como argumento.");
  console.error("Ejemplo: node scripts/update-address.js 0x1234...");
  process.exit(1);
}

// Rutas de archivos
const tokenlistPath = path.join(__dirname, "../tokenlists/doa-tokenlist.json");
const deploymentsPath = path.join(__dirname, "../deployments.json");
const readmePath = path.join(__dirname, "../README.md");

// 1. Actualizar tokenlist.json
let tokenlist = JSON.parse(fs.readFileSync(tokenlistPath, "utf8"));
tokenlist.tokens[0].address = contractAddress;
fs.writeFileSync(tokenlistPath, JSON.stringify(tokenlist, null, 2));
console.log("✅ Tokenlist actualizado con nueva dirección:", contractAddress);

// 2. Actualizar deployments.json
let deployments = {};
if (fs.existsSync(deploymentsPath)) {
  deployments = JSON.parse(fs.readFileSync(deploymentsPath, "utf8"));
}
deployments.address = contractAddress;
deployments.updatedAt = new Date().toISOString();
fs.writeFileSync(deploymentsPath, JSON.stringify(deployments, null, 2));
console.log("✅ deployments.json actualizado");

// 3. Actualizar README.md
let readme = fs.readFileSync(readmePath, "utf8");
readme = readme.replace(/Contrato \(Polygon\): .*/g, `Contrato (Polygon): ${contractAddress}`);
fs.writeFileSync(readmePath, readme);
console.log("✅ README.md actualizado");
