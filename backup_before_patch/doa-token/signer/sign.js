const { ethers } = require("ethers");

// ⚠️ Reemplaza con la clave privada de la dirección creadora
const wallet = new ethers.Wallet("TU_CLAVE_PRIVADA");

const message = "[polygonscan.com 25/12/2025 20:39:02] I, hereby verify that I am the owner/creator of the address [0xD6426Da6D01233Efe48dab6aD96cf3238f02c305]";

(async () => {
  try {
    const signature = await wallet.signMessage(message);
    console.log("Signature Hash:", signature);
  } catch (err) {
    console.error("Error al firmar:", err);
  }
})();
