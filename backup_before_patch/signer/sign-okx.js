const { ethers } = require("ethers");

async function main() {
  // Conectar a un provider RPC de Polygon (puedes usar el de OKX o el público)
  const provider = new ethers.providers.JsonRpcProvider("https://polygon-rpc.com");

  // ⚠️ Usa tu clave privada de la dirección creadora
  const wallet = new ethers.Wallet("0x5ae88372b6c3f041bcf436abe424b0c806d2a5bc612470ea8d6916bf0e455ae9", provider);

  const message = "[polygonscan.com 25/12/2025 20:39:02] I, hereby verify that I am the owner/creator of the address [0xD6426Da6D01233Efe48dab6aD96cf3238f02c305]";

  try {
    const signature = await wallet.signMessage(message);
    console.log("Signature Hash:", signature);
  } catch (err) {
    console.error("Error al firmar:", err);
  }
}

main();
