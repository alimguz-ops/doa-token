const { execSync } = require("child_process");
const path = require("path");
const fs = require("fs");

function run(cmd) {
  console.log(`â–¶ï¸ ${cmd}`);
  return execSync(cmd).toString().trim();
}

function main() {
  const reportsDir = path.join(process.cwd(), "reports");
  if (!fs.existsSync(reportsDir)) {
    console.log("âš ï¸ No existe carpeta reports todavÃ­a.");
    return;
  }

  try {
    const status = run("git status --porcelain reports");
    if (!status) {
      console.log("â„¹ï¸ No hay cambios en reports para commitear.");
      return;
    }

    run("git add reports");
    const msg = `Auto-report (${new Date().toLocaleString()})`;
    run(`git commit -m "${msg}"`);
    run("git push");
    console.log("âœ… Reportes subidos al repositorio remoto.");
  } catch (e) {
    console.error("âš ï¸ Error al subir reportes:", e.message);
    console.error(e.stack);
  }
}

main();
