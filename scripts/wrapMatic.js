import hardhat from "hardhat";
const { ethers } = hardhat;

async function main() {
  const wmaticAddress = process.env.BASE_TOKEN_ADDRESS;
  if (!wmaticAddress) {
    throw new Error("❌ Debes definir BASE_TOKEN_ADDRESS en tu .env con la dirección de WMATIC");
  }

  // Conectar al contrato WMATIC
  const wmaticAbi = [
    "function deposit() public payable",
    "function balanceOf(address) public view returns (uint256)"
  ];
  const wmatic = new ethers.Contract(wmaticAddress, wmaticAbi, await ethers.provider.getSigner());

  // Cantidad de MATIC a wrapear
  const amount = ethers.parseEther(process.env.LIQ_BASE_AMOUNT || "5");

  console.log(`⚙️ Wrapeando ${ethers.formatEther(amount)} MATIC → WMATIC...`);
  const tx = await wmatic.deposit({ value: amount });
  console.log("📄 Hash de wrap:", tx.hash);
  await tx.wait();

  const signer = await ethers.provider.getSigner();
  const balance = await wmatic.balanceOf(await signer.getAddress());
  console.log(`✅ Wrap completado. Balance WMATIC: ${ethers.formatEther(balance)} WMATIC`);
}

main().catch((e) => {
  console.error("❌ Error en wrapMatic:", e);
  process.exitCode = 1;
});
