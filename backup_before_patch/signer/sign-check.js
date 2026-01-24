const { Wallet } = require("ethers");

// ⚠️ Reemplaza con la clave privada de la dirección creadora
const wallet = new Wallet("0x5ae88372b6c3f041bcf436abe424b0c806d2a5bc612470ea8d6916bf0e455ae9");

const message = "[polygonscan.com 26/12/2025 01:26:00] I, hereby verify that I am the owner/creator of the address [0x692d951163df3f7D9Fe071413F92c319D9B7369E]";

(async () => {
  try {
    // Mostrar la dirección pública derivada de la clave privada
    console.log("Dirección pública derivada:", wallet.address);

    // Firmar el mensaje
    const signature = await wallet.signMessage(message);
    console.log("Signature Hash:", signature);
  } catch (err) {
    console.error("Error al firmar:", err);
  }
})();
