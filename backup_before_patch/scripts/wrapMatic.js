// scripts/wrapMatic.js
import hardhat from "hardhat";
const { ethers } = hardhat;

async function main() {
  const wmaticAddress = process.env.BASE_TOKEN_ADDRESS;
  if (!wmaticAddress || !ethers.isAddress(wmaticAddress)) {
    throw new Error("❌ Debes definir BASE_TOKEN_ADDRESS en tu .env con la dirección válida de WMATIC");
  }

  const wmaticAbi = [
    "function deposit() public payable",
    "function balanceOf(address) public view returns (uint256)"
  ];

  const signer = ethers.provider.getSigner();
  const wmatic = new ethers.Contract(wmaticAddress, wmaticAbi, signer);

  const amount = ethers.parseEther(process.env.LIQ_BASE_AMOUNT || "5");
  const signerAddress = await signer.getAddress();

  console.log(`👤 Signer: ${signerAddress}`);
  console.log(`⚙️ Wrapeando ${ethers.formatEther(amount)} MATIC → WMATIC...`);

  const tx = await wmatic.deposit({ value: amount });
  console.log("📄 Hash de wrap:", tx.hash);

  await tx.wait();

  const balance = await wmatic.balanceOf(signerAddress);
  console.log(`✅ Wrap completado. Balance WMATIC: ${ethers.formatEther(balance)} WMATIC`);
}

main().catch((err) => {
  console.error("❌ Error en wrapMatic:", err.message);
  process.exitCode = 1;
});