/**
 * Funciones auxiliares para scripts del proyecto DOA
 */

function log(message, level = "info") {
  const timestamp = new Date().toISOString();
  const prefix = level.toUpperCase();
  console.log(`[${timestamp}] [${prefix}] ${message}`);
}

module.exports = {
  log,
};