// cleanEntityTags.js (ESM + robusto)
import fs from "fs";
import path from "path";

// Carga de registros
const dataPath = path.join(process.cwd(), "entities.json");
const entities = JSON.parse(fs.readFileSync(dataPath, "utf8"));

// Corrección de etiquetas
const corrected = entities.map(entity => {
  entity.tags = entity.tags || [];
  entity.notes = entity.notes || "";

  if ((entity.name || "").toUpperCase() === "DOA" || (entity.symbol || "").toUpperCase() === "DOA") {
    if (entity.type === "person" || entity.tags.includes("fallecido")) {
      console.log(`Corrigiendo entidad: ${entity.name}`);
      entity.type = "token";
      entity.tags = entity.tags.filter(tag => tag !== "fallecido");
      entity.notes += " [Corrección automática: reclasificado como token]";
    }
  }
  return entity;
});

// Guardado del resultado
const outputPath = path.join(process.cwd(), "entities_corrected.json");
fs.writeFileSync(outputPath, JSON.stringify(corrected, null, 2));
console.log("✅ Corrección completada. Archivo guardado en entities_corrected.json");