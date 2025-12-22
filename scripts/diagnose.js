const { ethers } = require("hardhat");

async function main() {
  // Lista de direcciones a revisar
  const addresses = [
    "0xbf00Be03A0fD37120B920EDf9D54E6498856ce4F",
    "0xffe10D03DFbC63a92086ed11872961e30942B068",
    "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
    "0xdc5E348F47E80e879e26b6eE68Ef5c7Caab3E8fd",
    "0xf2513BF6187edc9EAf26d802bA1a1d9Cf6CA0448"
  ];

  for (const addr of addresses) {
    console.log("\n🔍 Revisando:", addr);

    try {
      const DoaToken = await ethers.getContractAt("DoaToken", addr);

      // Metadatos básicos
      const name = await DoaToken.name();
      const symbol = await DoaToken.symbol();
      const decimals = await DoaToken.decimals();
      const supply = await DoaToken.totalSupply();

      console.log("   📛 Name:", name);
      console.log("   🔤 Symbol:", symbol);
      console.log("   🧮 Decimals:", decimals);
      console.log("   📦 Total Supply:", supply.toString());

      // Intentar leer owner (si es Ownable)
      try {
        const owner = await DoaToken.owner();
        console.log("   👤 Owner:", owner);
      } catch {
        console.log("   ⚠️ No tiene función owner()");
      }

      // Intentar leer roles (si usa AccessControl)
      try {
        const DEFAULT_ADMIN_ROLE = await DoaToken.DEFAULT_ADMIN_ROLE();
        const hasAdmin = await DoaToken.hasRole(DEFAULT_ADMIN_ROLE, addr);
        console.log("   🔑 Admin role en esta dirección:", hasAdmin);
      } catch {
        console.log("   ⚠️ No usa AccessControl");
      }

    } catch (err) {
      console.log("   ❌ No es contrato ERC20 válido o no está verificado:", err.message);
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
