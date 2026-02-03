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

<!-- Botones de acción -->
<div style="display:flex; gap:20px; margin:20px 0;">
  <button id="btnGob" 
    style="background:#000; color:#DAA520; padding:12px 24px; border-radius:8px; font-weight:700; width:220px; height:60px; border:none; cursor:pointer;">
    Añadir liquidez → Mint Gobernanza
  </button>

  <button id="btnRec" 
    style="background:#000; color:#DAA520; padding:12px 24px; border-radius:8px; font-weight:700; width:220px; height:60px; border:none; cursor:pointer;">
    Reclamar → Mint Recompensas
  </button>

  <button id="btnMem" 
    style="background:#000; color:#DAA520; padding:12px 24px; border-radius:8px; font-weight:700; width:220px; height:60px; border:none; cursor:pointer;">
    Unirse → Mint Membresía
  </button>
</div>

<hr/>

<script src="https://cdn.jsdelivr.net/npm/ethers@6.7.0/dist/ethers.min.js"></script>
<script>
const CONTRACT_ADDRESS = "0xb6E66163e31a27eb92f67ff9AED8f6a5CCf1E074";
const ABI = [
  "function mintGobernanza(address to) external",
  "function mintRecompensas(address to, uint256 cantidad) external",
  "function mintMembresia(address to) external"
];

async function connectWallet() {
  if (!window.ethereum) {
    alert("Necesitas MetaMask u otra wallet Web3 instalada.");
    return null;
  }
  const provider = new ethers.BrowserProvider(window.ethereum);
  await provider.send("eth_requestAccounts", []);
  return provider.getSigner();
}

async function mintGobernanza() {
  const signer = await connectWallet();
  if (!signer) return;
  const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
  const tx = await contract.mintGobernanza(await signer.getAddress());
  await tx.wait();
  alert("✅ NFT Gobernanza acuñado con éxito");
}

async function mintRecompensas() {
  const signer = await connectWallet();
  if (!signer) return;
  const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
  const tx = await contract.mintRecompensas(await signer.getAddress(), 1);
  await tx.wait();
  alert("✅ NFT Recompensas acuñado con éxito");
}

async function mintMembresia() {
  const signer = await connectWallet();
  if (!signer) return;
  const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
  const tx = await contract.mintMembresia(await signer.getAddress());
  await tx.wait();
  alert("✅ NFT Membresía acuñado con éxito");
}

document.getElementById("btnGob").onclick = mintGobernanza;
document.getElementById("btnRec").onclick = mintRecompensas;
document.getElementById("btnMem").onclick = mintMembresia;
</script>
