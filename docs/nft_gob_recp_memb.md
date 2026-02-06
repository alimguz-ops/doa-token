---
layout: default
title: Ver ficha técnica NFT
permalink: /nft_gob_recp_memb.html
---

<h1>🖼 NFTs Oficiales DOA Token V2</h1>

<p>
Contrato ERC‑1155 en Polygon →  
<a href="https://polygonscan.com/address/0x9D8f14B92B980e05d347a02c9597d7D653d84687" target="_blank">
0x9D8f14B92B980e05d347a02c9597d7D653d84687 ↗
</a>
</p>

<hr/>

<style>
.btn-doa {
  background-color: #000;
  color: #DAA520;
  border: 2px solid #DAA520;
  padding: 10px 20px;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
}
.btn-doa:hover {
  background-color: #DAA520;
  color: #000;
}
</style>

<!-- NFT #1 Gobernanza -->
<div style="margin-bottom:40px;">
  <h2>🗳 NFT #1 – Gobernanza</h2>
  <img src="/docs/images/gobernanza.png" width="250" style="border:2px solid #DAA520; border-radius:8px;"/>
  <p><strong>Metadata:</strong> <a href="https://ipfs.io/ipfs/bafybeicaikipsbmqceez7n2dgi4gjogpz4hjdfbjwauuthmw33q7vd5zui/1.json" target="_blank">1.json ↗</a></p>
  <p>Condición: Stake ≥ 1000 DOA por ≥ 180 días</p>
  <button id="btnGob" class="btn-doa">Reclamar NFT Gobernanza</button>
  <p>Balance: <span id="balGob">0 / 1</span></p>
</div>

<!-- NFT #2 Recompensas -->
<div style="margin-bottom:40px;">
  <h2>🎁 NFT #2 – Recompensas</h2>
  <img src="/docs/images/recompensas.png" width="250" style="border:2px solid #DAA520; border-radius:8px;"/>
  <p><strong>Metadata:</strong> <a href="https://ipfs.io/ipfs/bafybeicaikipsbmqceez7n2dgi4gjogpz4hjdfbjwauuthmw33q7vd5zui/2.json" target="_blank">2.json ↗</a></p>
  <p>Condición: Reclamar recompensas de fidelidad o staking</p>
  <button id="btnRec" class="btn-doa">Reclamar NFT Recompensas</button>
  <p>Balance: <span id="balRec">0 / 1</span></p>
</div>

<!-- NFT #3 Membresía Básica -->
<div style="margin-bottom:40px;">
  <h2>🎫 NFT #3 – Membresía Básica</h2>
  <img src="/docs/images/membership.png" width="250" style="border:2px solid #DAA520; border-radius:8px;"/>
  <p><strong>Metadata:</strong> <a href="https://ipfs.io/ipfs/bafybeicaikipsbmqceez7n2dgi4gjogpz4hjdfbjwauuthmw33q7vd5zui/3.json" target="_blank">3.json ↗</a></p>
  <p>Condición: Stake ≥ 10 DOA por ≥ 30 días</p>
  <button id="btnMemBas" class="btn-doa">Reclamar Membresía Básica</button>
  <p>Balance: <span id="balMemBas">0 / 1</span></p>
</div>

<!-- NFT #4 Membresía Avanzada -->
<div style="margin-bottom:40px;">
  <h2>🎫 NFT #4 – Membresía Avanzada</h2>
  <img src="/docs/images/avanzada_membership.png" width="250" style="border:2px solid #DAA520; border-radius:8px;"/>
  <p><strong>Metadata:</strong> <a href="https://ipfs.io/ipfs/bafybeicaikipsbmqceez7n2dgi4gjogpz4hjdfbjwauuthmw33q7vd5zui/4.json" target="_blank">4.json ↗</a></p>
  <p>Condición: Stake ≥ 100 DOA por ≥ 90 días</p>
  <button id="btnMemAdv" class="btn-doa">Reclamar Membresía Avanzada</button>
  <p>Balance: <span id="balMemAdv">0 / 1</span></p>
</div>

<!-- NFT #5 Membresía Premium -->
<div style="margin-bottom:40px;">
  <h2>🎫 NFT #5 – Membresía Premium</h2>
  <img src="/docs/images/premium membership.png" width="250" style="border:2px solid #DAA520; border-radius:8px;"/>
  <p><strong>Metadata:</strong> <a href="https://ipfs.io/ipfs/bafybeicaikipsbmqceez7n2dgi4gjogpz4hjdfbjwauuthmw33q7vd5zui/5.json" target="_blank">5.json ↗</a></p>
  <p>Condición: Stake ≥ 500 DOA por ≥ 180 días</p>
  <button id="btnMemPrem" class="btn-doa">Reclamar Membresía Premium</button>
  <p>Balance: <span id="balMemPrem">0 / 1</span></p>
</div>

<!-- NFT #6 Gobernanza Premium -->
<div style="margin-bottom:40px;">
  <h2>🗳 NFT #6 – Gobernanza Premium</h2>
  <img src="/docs/images/governance_premium1.png" width="250" style="border:2px solid #DAA520; border-radius:8px;"/>
  <p><strong>Metadata:</strong> <a href="https://ipfs.io/ipfs/bafybeicaikipsbmqceez7n2dgi4gjogpz4hjdfbjwauuthmw33q7vd5zui/6.json" target="_blank">6.json ↗</a></p>
  <p>Condición: Stake ≥ 1000 DOA por ≥ 180 días + privilegios avanzados</p>
  <button id="btnGobPrem" class="btn-doa">Reclamar Gobernanza Premium</button>
  <p>Balance: <span id="balGobPrem">0 / 1</span></p>
</div>

<!-- NFT #7 Membresía Premium Extra -->
<div style="margin-bottom:40px;">
  <h2>🎫 NFT #7 – Membresía Premium Extra</h2>
  <img src="/docs/images/premium membership.png" 
       alt="NFT Membresía Premium Extra" width="250" 
       style="border:2px solid #DAA520; border-radius:8px;"/>
  <p><strong>Metadata:</strong> 
     <a href="https://ipfs.io/ipfs/bafybeicaikipsbmqceez7n2dgi4gjogpz4hjdfbjwauuthmw33q7vd5zui/7.json" target="_blank">7.json ↗</a>
  </p>
  <p>Condición: Stake prolongado con beneficios adicionales</p>
  <button id="btnMemExtra" class="btn-doa">Reclamar Membresía Extra</button>
  <p>Balance: <span id="balMemExtra">0 / 1</span></p>
</div>

<!-- NFT #8 Holder -->
<div style="margin-bottom:40px;">
  <h2>🛡 NFT #8 – Holder</h2>
  <img src="/docs/images/horlder.png" 
       alt="NFT Holder" width="250" 
       style="border:2px solid #DAA520; border-radius:8px;"/>
  <p><strong>Metadata:</strong> 
     <a href="https://ipfs.io/ipfs/bafybeicaikipsbmqceez7n2dgi4gjogpz4hjdfbjwauuthmw33q7vd5zui/8.json" target="_blank">8.json ↗</a>
  </p>
  <p>Condición: Poseer ≥ 5 DOA y registrarse como Holder</p>
  <button id="btnHolder" class="btn-doa">Registrarse como Holder</button>
  <p>Balance: <span id="balHolder">0 / 1</span></p>
</div>

<!-- NFT #9 Trader Básico -->
<div style="margin-bottom:40px;">
  <h2>📈 NFT #9 – Trader Básico</h2>
  <img src="/docs/images/trader_basic.png" 
       alt="NFT Trader Básico" width="250" 
       style="border:2px solid #DAA520; border-radius:8px;"/>
  <p><strong>Metadata:</strong> 
     <a href="https://ipfs.io/ipfs/bafybeicaikipsbmqceez7n2dgi4gjogpz4hjdfbjwauuthmw33q7vd5zui/9.json" target="_blank">9.json ↗</a>
  </p>
  <p>Condición: Volumen de trading ≥ 100 DOA</p>
  <button id="btnTraderBas" class="btn-doa">Reclamar NFT Trader Básico</button>
  <p>Balance: <span id="balTraderBas">0 / 1</span></p>
</div>

<!-- NFT #10 Trader Avanzado -->
<div style="margin-bottom:40px;">
  <h2>📈 NFT #10 – Trader Avanzado</h2>
  <img src="/docs/images/trader_avanzado.png" 
       alt="NFT Trader Avanzado" width="250" 
       style="border:2px solid #DAA520; border-radius:8px;"/>
  <p><strong>Metadata:</strong> 
     <a href="https://ipfs.io/ipfs/bafybeicaikipsbmqceez7n2dgi4gjogpz4hjdfbjwauuthmw33q7vd5zui/10.json" target="_blank">10.json ↗</a>
  </p>
  <p>Condición: Volumen de trading ≥ 1000 DOA</p>
  <button id="btnTraderAdv" class="btn-doa">Reclamar NFT Trader Avanzado</button>
  <p>Balance: <span id="balTraderAdv">0 / 1</span></p>
</div>

<!-- NFT #11 Trader Premium -->
<div style="margin-bottom:40px;">
  <h2>📈 NFT #11 – Trader Premium</h2>
  <img src="/docs/images/trader_premium.png" 
       alt="NFT Trader Premium" width="250" 
       style="border:2px solid #DAA520; border-radius:8px;"/>
  <p><strong>Metadata:</strong> 
     <a href="https://ipfs.io/ipfs/bafybeicaikipsbmqceez7n2dgi4gjogpz4hjdfbjwauuthmw33q7vd5zui/11.json" target="_blank">11.json ↗</a>
  </p>
  <p>Condición: Volumen de trading ≥ 10,000 DOA</p>
  <button id="btnTraderPrem" class="btn-doa">Reclamar NFT Trader Premium</button>
  <p>Balance: <span id="balTraderPrem">0 / 1</span></p>
</div>

<!-- NFT #12 Trader Élite -->
<div style="margin-bottom:40px;">
  <h2>📈 NFT #12 – Trader Élite</h2>
  <img src="/docs/images/trader_elite1.png" 
       alt="NFT Trader Élite" width="250" 
       style="border:2px solid #DAA520; border-radius:8px;"/>
  <p><strong>Metadata:</strong> 
     <a href="https://ipfs.io/ipfs/bafybeicaikipsbmqceez7n2dgi4gjogpz4hjdfbjwauuthmw33q7vd5zui/12.json" target="_blank">12.json ↗</a>
  </p>
  <p>Condición: Volumen de trading ≥ 50,000 DOA</p>
  <button id="btnTraderElite" class="btn-doa">Reclamar NFT Trader Élite</button>
  <p>Balance: <span id="balTraderElite">0 / 1</span></p>
</div>

<!-- NFT #13 Influencer -->
<div style="margin-bottom:40px;">
  <h2>📢 NFT #13 – Influencer</h2>
  <img src="/docs/images/influencer.png" 
       alt="NFT Influencer" width="250" 
       style="border:2px solid #DAA520; border-radius:8px;"/>
  <p><strong>Metadata:</strong> 
     <a href="https://ipfs.io/ipfs/bafybeicaikipsbmqceez7n2dgi4gjogpz4hjdfbjwauuthmw33q7vd5zui/13.json" target="_blank">13.json ↗</a>
  </p>
  <p>Condición: Poseer ≥ 5 DOA y registrarse como Influencer</p>
  <button id="btnInf" class="btn-doa">Registrarse como Influencer</button>
  <p>Balance: <span id="balInf">0 / 1</span></p>
</div>

<!-- Toast container -->
<div id="toast" style="position:fixed; top:20px; right:20px; background:#DAA520; color:#000; padding:15px 25px; border-radius:8px; font-weight:700; display:none; box-shadow:0 4px 8px rgba(0,0,0,0.3); z-index:9999;"></div>

<hr/>

<script src="https://cdn.jsdelivr.net/npm/ethers@6.7.0/dist/ethers.min.js"></script>
<script>
const CONTRACT_ADDRESS = "0xb6E66163e31a27eb92f67ff9AED8f6a5CCf1E074";
const ABI = [
  "function registerHolder() external",
  "function registerInfluencer() external",
  "function claimMembership() external",
  "function claimTraderNFT() external",
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

    const ids = [1,2,3,4,5,6,7,8,9,10,11,12,13];
    for (let id of ids) {
      const bal = await contract.balanceOf(addr, id);
      const span = document.getElementById("bal" + getNameById(id));
      if (span) span.innerText = bal.toString() + " / 1";
      const btn = document.getElementById("btn" + getNameById(id));
      if (btn && bal > 0n) btn.disabled = true;
    }
  } catch (err) {
    console.error("Error al consultar balances:", err);
  }
}

function getNameById(id) {
  switch(id) {
    case 1: return "Gob";
    case 2: return "Rec";
    case 3: return "MemBas";
    case 4: return "MemAdv";
    case 5: return "MemPrem";
    case 6: return "GobPrem";
    case 7: return "MemExtra";
    case 8: return "Holder";
    case 9: return "TraderBas";
    case 10: return "TraderAdv";
    case 11: return "TraderPrem";
    case 12: return "TraderElite";
    case 13: return "Inf";
    default: return "";
  }
}

async function runTx(fnName, args=[]) {
  try {
    const signer = await connectWallet();
    if (!signer) return;
    const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
    const tx = await contract[fnName](...args);
    await tx.wait();
    showToast("✅ Transacción ejecutada: " + fnName);
    await updateBalances();
  } catch (err) {
    showToast("❌ Error en " + fnName);
    console.error(err);
  }
}

async function getAddr() {
  const signer = await connectWallet();
  return signer ? await signer.getAddress() : null;
}

// Asignar botones a funciones correctas
document.getElementById("btnHolder").onclick = () => runTx("registerHolder");
document.getElementById("btnInf").onclick = () => runTx("registerInfluencer");
document.getElementById("btnMemBas").onclick = () => runTx("claimMembership");
document.getElementById("btnMemAdv").onclick = () => runTx("claimMembership");
document.getElementById("btnMemPrem").onclick = () => runTx("claimMembership");
document.getElementById("btnMemExtra").onclick = () => runTx("claimMembership");
document.getElementById("btnGobPrem").onclick = () => runTx("claimMembership");
document.getElementById("btnGob").onclick = () => runTx("claimMembership");
document.getElementById("btnRec").onclick = () => runTx("claimMembership");
document.getElementById("btnTraderBas").onclick = () => runTx("claimTraderNFT");
document.getElementById("btnTraderAdv").onclick = () => runTx("claimTraderNFT");
document.getElementById("btnTraderPrem").onclick = () => runTx("claimTraderNFT");
document.getElementById("btnTraderElite").onclick = () => runTx("claimTraderNFT");

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
