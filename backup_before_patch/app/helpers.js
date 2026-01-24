/**
 * Funciones comunes reutilizables en el proyecto DOA
 */

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function toWei(amount) {
  return (amount * 1e18).toString();
}

function fromWei(amount) {
  return parseFloat(amount) / 1e18;
}

module.exports = {
  sleep,
  toWei,
  fromWei
};
