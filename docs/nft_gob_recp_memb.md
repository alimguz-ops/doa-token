---
layout: default
title: NFTs DOA V2
permalink: /nft_gob_recp_memb.html
---

<h1>🖼 NFTs Oficiales DOA Token V2</h1>

<p>
Contrato ERC‑1155 en Polygon →  
<a href="https://polygonscan.com/address/0xb6E66163e31a27eb92f67ff9AED8f6a5CCf1E074#code" target="_blank">
0xb6E66163e31a27eb92f67ff9AED8f6a5CCf1E074 ↗
</a>
</p>

<p>Relación: vinculados a liquidez, comunidad y gobernanza DAO.</p>

<hr/>

<!-- NFT Gobernanza -->
<div style="margin-bottom:40px;">
  <h2>🗳 NFT #1 – Gobernanza</h2>
  <img src="https://ipfs.io/ipfs/bafybeiglq3q2yaafdwpszrxp4ahhmtzhdwkyhsu2f7fviqvlddrjwql3ii" alt="NFT Gobernanza" width="250" style="border:2px solid #DAA520; border-radius:8px;"/>
  <p><strong>Metadata:</strong> <a href="https://doatoken.org/docs/metadata/1.json" target="_blank">1.json ↗</a></p>
  <p>Privilegios de voto en la DAO</p>
  <button id="btnGob"
    style="background:#000; color:#DAA520; padding:12px 24px; border-radius:8px; font-weight:700; width:220px; height:60px; border:none; cursor:pointer;">
    Añadir liquidez → Mint Gobernanza
  </button>
</div>

<!-- NFT Recompensas -->
<div style="margin-bottom:40px;">
  <h2>🎁 NFT #2 – Recompensas</h2>
  <img src="https://ipfs.io/ipfs/bafybeiawzgpzdrgp4fglskpoblgf2ull4ymidtgda4safn5gx2dmnp2oti" alt="NFT Recompensas" width="250" style="border:2px solid #DAA520; border-radius:8px;"/>
  <p><strong>Metadata:</strong> <a href="https://doatoken.org/docs/metadata/2.json" target="_blank">2.json ↗</a></p>
  <p>Acceso a beneficios y distribución de recompensas</p>
  <button id="btnRec"
    style="background:#000; color:#DAA520; padding:12px 24px; border-radius:8px; font-weight:700; width:220px; height:60px; border:none; cursor:pointer;">
    Reclamar → Mint Recompensas
  </button>
</div>

<!-- NFT Membresía -->
<div style="margin-bottom:40px;">
  <h2>🎫 NFT #3 – Membresía</h2>
  <img src="https://ipfs.io/ipfs/bafybeiao74vnq343aqrh56ku2vjjkpy5ddbidijvhhi2u66tkdinsnm6wy" menbresia.png alt="NFT Membresía" width="250" style="border:2px solid #DAA520; border-radius:8px;"/>
  <p><strong>Metadata:</strong> <a href="https://doatoken.org/docs/metadata/3.json" target="_blank">3.json ↗</a></p>
  <p>Acceso exclusivo y beneficios de membresía</p>
  <button id="btnMem"
    style="background:#000; color:#DAA520; padding:12px 24px; border-radius:8px; font-weight:700; width:220px; height:60px; border:none; cursor:pointer;">
    Unirse → Mint Membresía
  </button>
</div>

<!-- Toast container -->
<div id="toast" style="position:fixed; top:20px; right:20px; background:#DAA520; color:#000; padding:15px 25px; border-radius:8px; font-weight:700; display:none; box-shadow:0 4px 8px rgba(0,0,0,0.3); z-index:9999;"></div>

<hr/>

<script src="https://cdn.jsdelivr.net/npm/ethers@6.7.0/dist/ethers.min.js"></script>
<script>
const CONTRACT_ADDRESS = "0xb6E66163e31a27eb92f67ff9AED8f6a5CCf1E074";
const ABI = [
  "function mintGobernanza(address to) external",
  "function mintRecompensas(address to, uint256 cantidad) external",
  "function mintMembresia(address to) external"
];

function showToast(message) {
  const toast = document.getElementById("toast");
  toast.innerText = message;
  toast.style.display = "block";
  setTimeout(() => { toast.style.display = "none"; }, 4000);
}

async function connectWallet() {
  if (!window.ethereum) {
    showToast("❌ Necesitas MetaMask u otra wallet Web3 instalada.");
    return null;
  }
  const provider = new ethers.BrowserProvider(window.ethereum);
  await provider.send("eth_requestAccounts", []);
  return provider.getSigner();
}

async function mintGobernanza() {
  const signer = await connectWallet();
  const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
  const tx = await contract.mint(await signer.getAddress(), 1, 1, "0x");
  await tx.wait();
  showToast("✅ NFT Gobernanza acuñado con éxito");
}

async function mintRecompensas() {
  const signer = await connectWallet();
  const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
  const tx = await contract.mint(await signer.getAddress(), 2, 1, "0x");
  await tx.wait();
  showToast("✅ NFT Recompensas acuñado con éxito");
}

async function mintMembresia() {
  const signer = await connectWallet();
  const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
  const tx = await contract.mint(await signer.getAddress(), 3, 1, "0x");
  await tx.wait();
  showToast("✅ NFT Membresía acuñado con éxito");
}
async function mintGobernanza() {
  const signer = await connectWallet();
  const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
  const tx = await contract.mint(await signer.getAddress(), 1, 1, "0x");
  await tx.wait();
  showToast("✅ NFT Gobernanza acuñado con éxito");
}
async function mintRecompensas() {
  const signer = await connectWallet();
  const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
  const tx = await contract.mint(await signer.getAddress(), 2, 1, "0x");
  await tx.wait();
  showToast("✅ NFT Recompensas acuñado con éxito");
}

async function mintMembresia() {
  const signer = await connectWallet();
  const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
  const tx = await contract.mint(await signer.getAddress(), 3, 1, "0x");
  await tx.wait();
  showToast("✅ NFT Membresía acuñado con éxito");
}

document.getElementById("btnGob").onclick = mintGobernanza;
document.getElementById("btnRec").onclick = mintRecompensas;
document.getElementById("btnMem").onclick = mintMembresia;
</script>
