// scripts/checkProxyTag.js
// Verifica si un contrato en Etherscan/Polygon tiene etiqueta de proxy único
// y guarda la dirección de implementación en deployments.json

const axios = require("axios");
const fs = require("fs");
require("dotenv").config();

async function checkProxyTag(contractAddress, network = "etherscan") {
  try {
    const apiKey = process.env.POLYGONSCAN_API_KEY; // 🔑 clave única para ambos
    let baseUrl;

    // Selección de red
    if (network === "polygon") {
      baseUrl = "https://api.polygonscan.com/api";
    } else {
      baseUrl = "https://api.etherscan.io/api";
    }

    const url = `${baseUrl}?module=contract&action=getsourcecode&address=${contractAddress}&apikey=${apiKey}`;
    const response = await axios.get(url);
    const data = response.data.result[0];

    if (data.Proxy === "1" && data.Implementation) {
      console.log(`✅ Proxy detectado en ${network}. Implementación: ${data.Implementation}`);

      // Guardar en deployments.json
      const deployments = JSON.parse(fs.readFileSync("deployments.json", "utf8"));
      deployments[contractAddress] = {
        proxy: true,
        implementation: data.Implementation,
        network,
        lastCheck: new Date().toISOString()
      };
      fs.writeFileSync("deployments.json", JSON.stringify(deployments, null, 2));
    } else {
      console.log(`ℹ️ No se detectó etiqueta de proxy único en ${network} para ${contractAddress}.`);
    }
  } catch (error) {
    console.error("❌ Error al consultar:", error.message);
  }
}

// Ejemplos de uso
checkProxyTag("0x6F52809EfdDF5826956EeF9C289A661624afb0cE", "etherscan"); // Contrato Etherscan
checkProxyTag("0x55f76fBa9df3AcE5a54Ba655f76aC9c76dc10411", "etherscan"); // Proxy Etherscan
checkProxyTag("0x692d951163df3f7D9Fe071413F92c319D9B7369E", "polygon");   // Contrato Polygon
checkProxyTag("0xD6426Da6D01233Efe48dab6aD96cf3238f02c305", "polygon");   // Proxy Polygon
