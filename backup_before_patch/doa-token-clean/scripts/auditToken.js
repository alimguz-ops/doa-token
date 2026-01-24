// scripts/auditToken.js
import fs from "fs";
import path from "path";
import solc from "solc";

function loadContract(filePath) {
  const source = fs.readFileSync(filePath, "utf8");
  return source;
}

function compileContract(source) {
  const input = {
    language: "Solidity",
    sources: {
      "DoaToken.sol": { content: source }
    },
    settings: {
      optimizer: { enabled: true, runs: 200 },
      outputSelection: {
        "*": {
          "*": ["abi", "evm.bytecode", "evm.deployedBytecode"]
        }
      }
    }
  };
  const output = JSON.parse(solc.compile(JSON.stringify(input)));
  return output;
}

function auditContract(output) {
  const errors = [];
  const contract = output.contracts["DoaToken.sol"]["DoaToken"];

  // Verificar que existe ABI y bytecode
  if (!contract.abi) errors.push("❌ ABI no generado");
  if (!contract.evm.bytecode.object) errors.push("❌ Bytecode vacío");

  // Revisar funciones ERC20 básicas
  const abiFunctions = contract.abi.map(f => f.name).filter(Boolean);
  const required = ["name", "symbol", "decimals", "totalSupply", "transfer", "approve", "transferFrom"];
  required.forEach(fn => {
    if (!abiFunctions.includes(fn)) errors.push(`❌ Falta función ERC20: ${fn}`);
  });

  // Revisar supply inicial
  const bytecode = contract.evm.bytecode.object;
  if (!bytecode.includes("mint")) {
    errors.push("⚠️ No se detecta _mint en el constructor");
  }

  return errors.length ? errors : ["✅ Estructura ERC20 correcta"];
}

async function main() {
  const contractPath = path.join(process.cwd(), "contracts", "DoaToken.sol");
  const source = loadContract(contractPath);
  const output = compileContract(source);

  if (output.errors) {
    console.log("⚠️ Errores de compilación:");
    output.errors.forEach(e => console.log(e.formattedMessage));
  }

  const audit = auditContract(output);
  console.log("🔎 Resultados de auditoría:");
  audit.forEach(line => console.log(line));
}

main().catch(err => console.error(err));
