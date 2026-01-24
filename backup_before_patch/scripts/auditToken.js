// scripts/auditToken.js (ESM mejorado)
import fs from "fs";
import path from "path";
import solc from "solc";

function loadContract(filePath) {
  return fs.readFileSync(filePath, "utf8");
}

function compileContract(source) {
  const input = {
    language: "Solidity",
    sources: { "DoaToken.sol": { content: source } },
    settings: {
      optimizer: { enabled: true, runs: 200 },
      outputSelection: { "*": { "*": ["abi", "evm.bytecode", "evm.deployedBytecode"] } }
    }
  };
  return JSON.parse(solc.compile(JSON.stringify(input)));
}

function auditContract(output) {
  const errors = [];
  const contractFile = "DoaToken.sol";
  const contractName = "DoaToken";
  const contract = output.contracts?.[contractFile]?.[contractName];
  if (!contract) return ["❌ No se encontró el contrato en la compilación"];

  if (!contract.abi) errors.push("❌ ABI no generado");
  if (!contract.evm?.bytecode?.object) errors.push("❌ Bytecode vacío");

  const abiFunctions = contract.abi.map(f => f.name?.toLowerCase()).filter(Boolean);
  const required = ["name","symbol","decimals","totalsupply","transfer","approve","transferfrom"];
  required.forEach(fn => {
    if (!abiFunctions.includes(fn)) errors.push(`❌ Falta función ERC20: ${fn}`);
  });

  if (!abiFunctions.includes("mint")) {
    errors.push("⚠️ No se detecta función mint en el contrato");
  }

  return errors.length ? errors : ["✅ Estructura ERC20 correcta"];
}

async function main() {
  const contractPath = path.join(process.cwd(), "contracts", "DoaToken.sol");
  const source = loadContract(contractPath);
  const output = compileContract(source);

  if (output.errors) {
    output.errors.forEach(e => {
      if (e.severity === "error") console.error("❌", e.formattedMessage);
      else console.warn("⚠️", e.formattedMessage);
    });
  }

  const audit = auditContract(output);
  console.log("🔎 Resultados de auditoría:");
  audit.forEach(line => console.log(line));
}

main().catch(err => console.error(err));