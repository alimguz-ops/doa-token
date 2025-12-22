const { execSync } = require("child_process");
const path = require("path");
const fs = require("fs");

function run(cmd) {
  console.log(`▶️ ${cmd}`);
  execSync(cmd, { stdio: "inherit" });
}

function main() {
  const reportsDir = path.join(process.cwd(), "reports");
  if (!fs.existsSync(reportsDir)) {
    console.log("⚠️ No existe carpeta reports todavía.");
    return;
  }

  try {
    run("git add reports");
    const msg = `Auto-report ${new Date().toISOString()}`;
    run(`git commit -m "${msg}"`);
    run("git push");
    console.log("✅ Reportes subidos al repositorio remoto.");
  } catch (e) {
    console.log("⚠️ Error al subir reportes:", e.message);
  }
}

main();
