// scripts/update-address.js
const fs = require("fs");
const path = require("path");

// 1. Obtener dirección del contrato (argumento o variable de entorno)
const contractAddress = process.argv[2] || process.env.CONTRACT_ADDRESS;

if (!contractAddress) {
  console.error("❌ No se encontró la dirección del contrato.");
  console.error("Usa: node scripts/update-address.js 0x1234...");
  console.error("O define la variable de entorno CONTRACT_ADDRESS.");
  process.exit(1);
}

// Validar formato de dirección (0x + 40 hexadecimales)
if (!/^0x[a-fA-F0-9]{40}$/.test(contractAddress)) {
  console.error("❌ Dirección de contrato inválida:", contractAddress);
  process.exit(1);
}

// 2. Rutas de archivos
const tokenlistPath = path.join(__dirname, "../tokenlists/doa-tokenlist.json");
const deploymentsPath = path.join(__dirname, "../deployments.json");
const readmePath = path.join(__dirname, "../README.md");

// 3. Actualizar tokenlist.json
try {
  const tokenlist = JSON.parse(fs.readFileSync(tokenlistPath, "utf8"));
  if (Array.isArray(tokenlist.tokens) && tokenlist.tokens.length > 0) {
    tokenlist.tokens[0].address = contractAddress;
    fs.writeFileSync(tokenlistPath, JSON.stringify(tokenlist, null, 2));
    console.log("✅ Tokenlist actualizado con nueva dirección:", contractAddress);
  } else {
    console.warn("⚠️ No se encontró tokens[0] en tokenlist.json");
  }
} catch (err) {
  console.error("❌ Error actualizando tokenlist:", err.message);
  process.exit(1);
}

// 4. Actualizar deployments.json
try {
  let deployments = {};
  if (fs.existsSync(deploymentsPath)) {
    deployments = JSON.parse(fs.readFileSync(deploymentsPath, "utf8"));
  }
  deployments.address = contractAddress;
  deployments.updatedAt = new Date().toISOString();
  fs.writeFileSync(deploymentsPath, JSON.stringify(deployments, null, 2));
  console.log("✅ deployments.json actualizado");
} catch (err) {
  console.error("❌ Error actualizando deployments.json:", err.message);
  process.exit(1);
}

// 5. Actualizar README.md
try {
  let readme = fs.readFileSync(readmePath, "utf8");
  const regex = /Contrato \(Polygon\): .*/;
  if (regex.test(readme)) {
    readme = readme.replace(regex, `Contrato (Polygon): ${contractAddress}`);
  } else {
    // Añadir al final si no existe
    readme = `${readme.trim()}\n\nContrato (Polygon): ${contractAddress}\n`;
  }
  fs.writeFileSync(readmePath, readme);
  console.log("✅ README.md actualizado");
} catch (err) {
  console.error("❌ Error actualizando README.md:", err.message);
  process.exit(1);
}
