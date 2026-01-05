/**
 * Utilidades principales para el proyecto DOA
 * Estas funciones apoyan los scripts de deploy y monitoreo
 */

function formatTimestamp() {
  const now = new Date();
  return now.toISOString();
}

function logEvent(message) {
  console.log(`[${formatTimestamp()}] ${message}`);
}

function validateAddress(address) {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

module.exports = {
  formatTimestamp,
  logEvent,
  validateAddress
};
