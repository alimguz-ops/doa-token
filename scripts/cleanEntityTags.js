// cleanEntityTags.js
const fs = require('fs');
const path = require('path');

// Carga de registros
const dataPath = path.join(__dirname, 'entities.json'); // archivo con registros
const entities = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

// Corrección de etiquetas
const corrected = entities.map(entity => {
  if (entity.name === 'DOA' || entity.symbol === 'DOA') {
    // Verifica si fue clasificado como persona
    if (entity.type === 'person' || entity.tags.includes('fallecido')) {
      console.log(`Corrigiendo entidad: ${entity.name}`);
      entity.type = 'token';
      entity.tags = entity.tags.filter(tag => tag !== 'fallecido');
      entity.notes = (entity.notes || '') + ' [Corrección automática: reclasificado como token]';
    }
  }
  return entity;
});

// Guardado del resultado
const outputPath = path.join(__dirname, 'entities_corrected.json');
fs.writeFileSync(outputPath, JSON.stringify(corrected, null, 2));
console.log('✅ Corrección completada. Archivo guardado en entities_corrected.json');
