// scripts/updateDeployment.js
// Actualiza deployments.json con datos de proxy e implementación
// para DOA V2 en Ethereum y Polygon

const axios = require("axios");
const fs = require("fs");
require("dotenv").config();

async function updateDeployment(name, proxyAddress, implementationAddress, network = "mainnet") {
  try {
    const apiKey = process.env.POLYGONSCAN_API_KEY; // 🔑 clave única para ambos
    let baseUrl;

    if (network === "polygon") {
      baseUrl = "https://api.polygonscan.com/api";
    } else {
      baseUrl = "https://api.etherscan.io/api";
    }

    const url = `${baseUrl}?module=contract&action=getsourcecode&address=${proxyAddress}&apikey=${apiKey}`;
    const response = await axios.get(url);
    const data = response.data.result[0];

    let impl = implementationAddress;
    let proxyFlag = false;

    if (data.Proxy === "1" && data.Implementation) {
      proxyFlag = true;
      impl = data.Implementation;
      console.log(`✅ Proxy detectado en ${network}. Implementación: ${impl}`);
    } else {
      console.log(`ℹ️ Proxy no etiquetado aún en ${network}, usando implementación manual: ${impl}`);
    }

    // Leer archivo actual
    let deployments = {};
    if (fs.existsSync("deployments.json")) {
      deployments = JSON.parse(fs.readFileSync("deployments.json", "utf8"));
    }

    // Actualizar bloque
    deployments[name] = {
      proxy: proxyAddress,
      implementation: impl,
      proxyFlag,
      network,
      timestamp: new Date().toISOString()
    };

    // Guardar archivo
    fs.writeFileSync("deployments.json", JSON.stringify(deployments, null, 2));
    console.log(`📁 deployments.json actualizado para ${name}`);
  } catch (error) {
    console.error("❌ Error al actualizar:", error.message);
  }
}

// Ejemplo de uso para DOA V2 en Ethereum y Polygon
(async () => {
  await updateDeployment(
    "DOA_V2_ETH",
    "0x6F52809EfdDF5826956EeF9C289A661624afb0cE", // contrato proxy en Etherscan
    "0x55f76fBa9df3AcE5a54Ba655f76aC9c76dc10411", // implementación en Etherscan
    "mainnet"
  );

  await updateDeployment(
    "DOA_V2_POLYGON",
    "0xD6426Da6D01233Efe48dab6aD96cf3238f02c305", // contrato proxy en Polygon
    "0x692d951163df3f7D9Fe071413F92c319D9B7369E", // implementación en Polygon
    "polygon"
  );
})();
