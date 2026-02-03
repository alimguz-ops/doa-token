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
  <p>Balance: <span id="balGob">-</span> / 1</p>
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
  <p>Balance: <span id="balRec">-</span></p>
</div>

<!-- NFT Membresía -->
<div style="margin-bottom:40px;">
  <h2>🎫 NFT #3 – Membresía</h2>
  <img src="https://ipfs.io/ipfs/bafybeiao74vnq343aqrh56ku2vjjkpy5ddbidijvhhi2u66tkdinsnm6wy" alt="NFT Membresía" width="250" style="border:2px solid #DAA520; border-radius:8px;"/>
  <p><strong>Metadata:</strong> <a href="https://doatoken.org/docs/metadata/3.json" target="_blank">3.json ↗</a></p>
  <p>Acceso exclusivo y beneficios de membresía</p>
  <button id="btnMem"
    style="background:#000; color:#DAA520; padding:12px 24px; border-radius:8px; font-weight:700; width:220px; height:60px; border:none; cursor:pointer;">
    Unirse → Mint Membresía
  </button>
  <p>Balance: <span id="balMem">-</span> / 1</p>
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
  "function mintMembresia(address to) external",
  "function balanceOf(address account, uint256 id) view returns (uint256)"
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

async function updateBalances() {
  try {
    const signer = await connectWallet();
    if (!signer) return;
    const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
    const addr = await signer.getAddress();

    const gob = await contract.balanceOf(addr, 1);
    const rec = await contract.balanceOf(addr, 2);
    const mem = await contract.balanceOf(addr, 3);

    document.getElementById("balGob").innerText = gob.toString() + " / 1";
    document.getElementById("balRec").innerText = rec.toString();
    document.getElementById("balMem").innerText = mem.toString() + " / 1";

    // Desactivar botones si ya tiene Gobernanza o Membresía
    if (gob > 0n) document.getElementById("btnGob").disabled = true;
    if (mem > 0n) document.getElementById("btnMem").disabled = true;
  } catch (err) {
    console.error("Error al consultar balances:", err);
  }
}

async function mintGobernanza() {
  try {
    const signer = await connectWallet();
    if (!signer) return;
    const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
    const addr = await signer.getAddress();
    const tx = await contract.mintGobernanza(addr);
    await tx.wait();
    showToast("✅ NFT Gobernanza acuñado con éxito");
    await updateBalances();
  } catch (err) {
    showToast("❌ Error al acuñar Gobernanza");
    console.error(err);
  }
}

async function mintRecompensas() {
  try {
    const signer = await connectWallet();
    if (!signer) return;
    const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
    const addr = await signer.getAddress();
    const tx = await contract.mintRecompensas(addr, 1);
    await tx.wait();
    showToast("✅ NFT Recompensas acuñado con éxito");
    await updateBalances();
  } catch (err) {
    showToast("❌ Error al acuñar Recompensas");
    console.error(err);
  }
}

async function mintMembresia() {
  try {
    const signer = await connectWallet();
    if (!signer) return;
    const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
    const addr = await signer.getAddress();
    const tx = await contract.mintMembresia(addr);
    await tx.wait();
    showToast("✅ NFT Membresía acuñado con éxito");
    await updateBalances();
  } catch (err) {
    showToast("❌ Error al acuñar Membresía");
    console.error(err);
  }
}

document.getElementById("btnGob").onclick = mintGobernanza;
document.getElementById("btnRec").onclick = mintRecompensas;
document.getElementById("btnMem").onclick = mintMembresia;

// Actualizar balances al cargar la página
window.onload = updateBalances;
</script>

<!-- Pie de página institucional -->
<footer style="margin-top:30px; padding:15px; background:#111; text-align:center; border-top:2px solid #DAA520; color:#eee; font-family:'Segoe UI', Arial, sans-serif;">
  
  <!-- Línea de certificaciones en una sola fila -->
  <div style="font-size:13px; font-weight:600; margin-bottom:6px; color:#ccc;">
    🔒 SSL activo / 📂 Repositorio público / ✅ Auditoría en curso / 📜 Política de privacidad
  </div>

  <!-- Fecha de actualización -->
  <div style="font-size:13px; font-weight:600; color:#DAA520; margin-bottom:6px;">
    Última actualización: Febrero 2026
  </div>

  <!-- Correo institucional -->
  <div style="font-size:13px; color:#ccc;">
    📧 Contacto: <a href="mailto:info@doatoken.org" style="color:#DAA520; text-decoration:none;">info@doatoken.org</a>
  </div>
</footer>

  <!-- Scripts adicionales (PopAds) -->
  <!-- ⚠️ Este bloque es opcional. Si no quieres anuncios emergentes, elimínalo -->
  <script type="text/javascript" data-cfasync="false">
  (function(){
    var e = window,
        o = "d30821c03f80282ac46bbccfd6ee5e68",
        x = [["siteId",676-211+380+410*19+5263358],["minBid",0],["popundersPerIP","0"],["delayBetween",0],["default",false],["defaultPerDay",0],["topmostLayer","auto"]],
        i = ["d3d3LmJldHRlcmFkc3lzdGVtLmNvbS9zaW1naXgtY29yZS1qcy5jc3M=","ZDJrazBvM2ZyN2VkMDEuY2xvdWRmcm9udC5uZXQvSi9lc3BsaXQubWluLmpz"],
        v = -1, w, b;
    var z = function(){
      clearTimeout(b);
      v++;
      if(i[v] && !(1795733348000 < (new Date).getTime() && 1 < v)){
        w = e.document.createElement("script");
        w.type = "text/javascript";
        w.async = true;
        var d = e.document.getElementsByTagName("script")[0];
        w.src = "https://" + atob(i[v]);
        w.crossOrigin = "anonymous";
        w.onerror = z;
        w.onload = function(){ clearTimeout(b); if(!e[o.slice(0,16)+o.slice(0,16)]) z(); };
        b = setTimeout(z, 5000);
        d.parentNode.insertBefore(w, d);
      }
    };
    if(!e[o]){
      try{ Object.freeze(e[o] = x); }catch(err){}
      z();
    }
  })();
  </script>
  </body>
</html>
