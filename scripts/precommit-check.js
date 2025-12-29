const { execSync } = require("child_process");

function run(cmd) {
  return execSync(cmd).toString().trim();
}

// Archivos que se van a commitear
const staged = run("git diff --cached --name-only");

if (staged.includes(".env")) {
  console.error("❌ ERROR: Intentas commitear un archivo .env (prohibido).");
  process.exit(1);
}

// Buscar claves privadas en los archivos staged
const secretsRegex = /(PRIVATE_KEY|MNEMONIC|SEED|API_KEY)/i;

staged.split("\n").forEach(file => {
  if (!file) return;
  const content = run(`git show :${file}`);
  if (secretsRegex.test(content)) {
    console.error(`❌ ERROR: El archivo ${file} contiene posibles claves privadas.`);
    process.exit(1);
  }
});

console.log("✅ Pre-commit check passed. No secrets found.");
