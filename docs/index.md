<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>DOA Token V2</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <!-- Google Analytics (opcional) -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-KCRHDKJFF5"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){ dataLayer.push(arguments); }
    gtag('js', new Date());
    gtag('config', 'G-KCRHDKJFF5');
  </script>

  <!-- Google AdSense (opcional) -->
  <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1802989521678619"
          crossorigin="anonymous"></script>

  <!-- Ethers.js -->
  <script src="https://cdn.jsdelivr.net/npm/ethers/dist/ethers.min.js"></script>
</head>
<body style="background:#111; color:#fff; font-family:Arial, sans-serif; margin:0;">

  <!-- Título -->
  <h1 style="text-align:center; margin-top:20px;">🪙 DOA Token V2</h1>
  <p style="text-align:center; font-weight:bold;">Verified • Transparent • Community Driven</p>
  <p style="text-align:center;">Bienvenido al sitio oficial del proyecto.</p>

  <!-- Idiomas -->
  <div style="text-align:center; margin:12px 0; display:flex; justify-content:center; gap:10px; flex-wrap:wrap;">
    <a href="/es/" style="background:#DAA520; color:#000; padding:8px 14px; border-radius:6px; text-decoration:none; font-size:13px; font-weight:bold;">Español</a>
    <a href="/en/" style="background:#DAA520; color:#000; padding:8px 14px; border-radius:6px; text-decoration:none; font-size:13px; font-weight:bold;">English</a>
  </div>

  <!-- Bloque de confianza -->
  <div style="max-width:900px; margin:24px auto; padding:20px; background:linear-gradient(180deg,#000 0%, #0a0a0a 100%); border:2px solid #DAA520; border-radius:12px; box-shadow:0 10px 30px rgba(0,0,0,0.6); text-align:center;">
    <h2 style="color:#DAA520;">Confianza y Seguridad</h2>
    <p>
      <strong style="color:#DAA520;">DOA Token V2</strong> utiliza un <strong style="color:#DAA520;">proxy temporal</strong> para gestionar actualizaciones seguras y auditadas.
    </p>
    <ul style="list-style:none; padding:0; margin:0; text-align:left; display:inline-block;">
      <li>🔸 Liquidez y <strong style="color:#DAA520;">staking</strong> con recompensas automáticas cada día</li>
      <li>🔸 <strong style="color:#DAA520;">Proxy temporal</strong> para actualizaciones seguras y auditadas</li>
      <li>🔸 Auditorías periódicas y reportes públicos</li>
      <li>🔸 Comunidad que recompensa tu confianza</li>
    </ul>
    <div style="display:flex; gap:10px; justify-content:center; flex-wrap:wrap;">
      <a href="https://quickswap.exchange/#/swap?inputCurrency=0x692d951163df3f7D9Fe071413F92c319D9B7369E" target="_blank" style="background:#DAA520; color:#000; padding:8px 14px; border-radius:8px; text-decoration:none; font-weight:700;">Añadir liquidez ↗</a>
      <a href="https://app.uniswap.org/#/swap?inputCurrency=0x692d951163df3f7D9Fe071413F92c319D9B7369E" target="_blank" style="background:#DAA520; color:#000; padding:8px 14px; border-radius:8px; text-decoration:none; font-weight:700;">Comprar / Invertir ↗</a>
      <a href="#contratos" style="background:transparent; color:#DAA520; padding:8px 14px; border-radius:8px; text-decoration:none; font-weight:700; border:1px solid rgba(218,165,32,0.18);">Ver contratos</a>
    </div>
  </div>

  <!-- Contratos -->
  <h2 id="contratos">🔗 Contratos Oficiales</h2>
  <ul>
    <li>Ethereum Main → <a href="https://etherscan.io/address/0x6F52809EfdDF5826956EeF9C289A661624afb0cE" target="_blank">0x6F52809EfdDF5826956EeF9C289A661624afb0cE</a></li>
    <li>Ethereum Proxy → <a href="https://etherscan.io/address/0x55f76fBa9df3AcE5a54Ba655f76aC9c76dc10411" target="_blank">0x55f76fBa9df3AcE5a54Ba655f76aC9c76dc10411</a></li>
    <li>Polygon Main → <a href="https://polygonscan.com/address/0x692d951163df3f7D9Fe071413F92c319D9B7369E" target="_blank">0x692d951163df3f7D9Fe071413F92c319D9B7369E</a></li>
    <li>Polygon Proxy → <a href="https://polygonscan.com/address/0xD6426Da6D01233Efe48dab6aD96cf3238f02c305" target="_blank">0xD6426Da6D01233Efe48dab6aD96cf3238f02c305</a></li>
  </ul>

  <!-- NFT -->
  <h2>🖼 NFT Oficial</h2>
  <p>
    NFT_DOAV2 → 
    <a href="https://polygonscan.com/address/0x9D8f14B92B980e05d347a02c9597d7D653d84687" target="_blank">
      0x9D8f14B92B980e05d347a02c9597d7D653d84687 ↗
    </a>
  </p>
  <p>Relación: vinculado a liquidez y comunidad</p>

  <!-- Botón de acceso a documentación NFT -->
  <div style="text-align:center; margin:12px 0;">
    <a href="/nft_gob_recp_memb.html" 
      style="background:#DAA520; color:#000; padding:8px 14px; border-radius:8px; text-decoration:none; font-size:13px; font-weight:bold;">
      📄 Ver ficha técnica NFT ↗
    </a>
  </div>

  <!-- Botón para conectar la wallet -->
  <div style="text-align:center; margin:20px 0;">
    <a href="javascript:void(0);" onclick="connectWallet()" 
      style="background:#DAA520; color:#000; padding:10px 18px; border-radius:8px; text-decoration:none; font-weight:700; display:inline-block;">
      🔗 Conectar Wallet
    </a>
  </div>

  <!-- Estado del usuario -->
  <p style="text-align:center; margin-top:10px;">
    Usuarios registrados: <span id="userCount">0</span><br>
    Estado NFT: <span id="nftStatus">No conectado</span>
  </p>

  <!-- 🌐 Comunidad -->
  <h2>🌐 Comunidad</h2>
  <div style="text-align:center; margin:12px 0; display:flex; justify-content:center; gap:6px; flex-wrap:wrap;">
  <a href="https://discord.gg/TCXB69cm" target="_blank" 
     style="background:#DAA520; color:#000; padding:6px 10px; border-radius:6px; text-decoration:none; font-size:12px; font-weight:bold;">💬 Discord</a>
  <a href="https://x.com/DoaV270493" target="_blank" 
     style="background:#DAA520; color:#000; padding:6px 10px; border-radius:6px; text-decoration:none; font-size:12px; font-weight:bold;">🐦 Twitter/X</a>
  <a href="https://t.me/DoaTokenV2" target="_blank" 
     style="background:#DAA520; color:#000; padding:6px 10px; border-radius:6px; text-decoration:none; font-size:12px; font-weight:bold;">📱 Telegram</a>
  <a href="https://github.com/alimguz-ops/doa-token" target="_blank" 
     style="background:#DAA520; color:#000; padding:6px 10px; border-radius:6px; text-decoration:none; font-size:12px; font-weight:bold;">💻 GitHub</a>
</div>

  <!-- 👤 Fundador -->
  <h2>👤 Fundador</h2>
  <p style="text-align:center;">
    <strong>Angel R. Linares </strong><br>
    – Fundador único, responsable de arquitectura técnica, cumplimiento, comunidad y operaciones<br>
    – Sole founder, responsible for technical architecture, compliance, community, and operations.
  </p>

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

  <!-- Script de conexión con contrato DOA + NFT -->
  <script type="text/javascript">
    const ADDRESSES = {
      polygon: {
        registro: "0x692d951163df3f7D9Fe071413F92c319D9B7369E", // Contrato DOA en Polygon
        proxy:    "0xD6426Da6D01233Efe48dab6aD96cf3238f02c305", // Proxy en Polygon
        nft:      "0xc497377bDFA6e651A4f9E5C44531c9D034a13523"  // NFT oficial en Polygon
      },
      ethereum: {
        registro: "0x6F52809EfdDF5826956EeF9C289A661624afb0cE", // Contrato DOA en Ethereum
        proxy:    "0x55f76fBa9df3AcE5a54Ba655f76aC9c76dc10411"  // Proxy en Ethereum
      }
    };

    const nftAbi = [
      "function balanceOf(address owner) view returns (uint256)"
    ];

    async function connectWallet() {
      try {
        if (!window.ethereum) {
          alert("Necesitas MetaMask u otra wallet Web3 instalada.");
          return;
        }

        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const address = await signer.getAddress();

        const network = await provider.getNetwork();
        let nftAddress;

        if (network.chainId === 137) { // Polygon Mainnet
          nftAddress = ADDRESSES.polygon.nft;
        } else if (network.chainId === 1) { // Ethereum Mainnet
          nftAddress = null;
        } else {
          alert("Red no soportada. Conéctate a Polygon o Ethereum.");
          return;
        }

        // Actualiza contador de usuarios (demo: 1 conectado)
        document.getElementById("userCount").innerText = "1";

        if (nftAddress) {
          const nft = new ethers.Contract(nftAddress, nftAbi, signer);
          const balance = await nft.balanceOf(address);
          document.getElementById("nftStatus").innerText = balance > 0
            ? "✅ Posees NFT de gobernanza: privilegios de votación activados."
            : "⚠️ No posees NFT de gobernanza. Conéctate para obtener uno y participar.";
        } else {
          document.getElementById("nftStatus").innerText = "ℹ️ NFT de gobernanza disponible solo en Polygon.";
        }
      } catch (err) {
        console.error("Error al conectar wallet:", err);
        alert("No se pudo conectar la wallet. Verifica MetaMask y la red.");
      }
    }
  </script>
</body>
</html>
