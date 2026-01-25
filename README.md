---
layout: default
title: README
---

# 🪙 DOA Token V2 – Project Documentation  
# 🪙 Documentación del Proyecto DOA Token V2

<p align="center">
  <img src="docs/assets/brand/doa-flat.svg" alt="DOA Token V2 Logo" width="150"/>
</p>

<p align="center">
  <strong>Verified • Transparent • Community Driven</strong>
</p>

---

## 📖 Descripción / Description
DOA Token V2 es un proyecto autosostenible que combina gobernanza, liquidez, marketing automatizado y distribución de recompensas.  
DOA Token V2 is a self-sustaining project combining governance, liquidity, automated marketing, and rewards distribution.

---

## ✨ Características principales / Key Features
- Contrato proxy para actualizaciones seguras / Proxy contract for secure upgrades.  
- Scripts de monitoreo de liquidez / Liquidity monitoring scripts.  
- Auditoría externa pendiente / External audit pending.  
- Documentación legal AML/KYC en proceso / AML/KYC legal documentation in progress.  
- Gobernanza DAO con votaciones transparentes / DAO governance with transparent voting.  
- Marketing automatizado con scripts y calendario JSON / Automated marketing with scripts and JSON calendar.  

---

## 📂 Estructura del repositorio / Repository Structure
- `contracts/` → contratos inteligentes / smart contracts  
- `scripts/` → automatización y monitoreo / automation & monitoring  
- `deployments/` → registros de despliegue / deployment logs  
- `docs/` → documentación general / general documentation  
- `audit/` → auditoría externa / external audit  
- `legal/` → compliance legal / legal compliance  
- `app/` → módulos de utilidad / utility modules  
- `cex-application/` → aplicación a exchanges / CEX application  

---

## 🌐 Ecosistema / Ecosystem
- **Contrato en Polygonscan:** [0x692d951163df3f7D9Fe071413F92c319D9B7369E](https://polygonscan.com/address/0x692d951163df3f7D9Fe071413F92c319D9B7369E)  
- **Repositorio operativo (GitHub):** [alimguz-ops/doa-token](https://github.com/alimguz-ops/doa-token)  
- **Tokenomics:** [TOKENOMICS.md](docs/TOKENOMICS.md)  

---

## 📢 Redes oficiales / Official Channels
- **Discord:** [https://discord.gg/TCXB69cm](https://discord.gg/TCXB69cm)  
- **Twitter/X:** [https://x.com/DoaV270493](https://x.com/DoaV270493)  
- **Telegram:** [https://t.me/DoaTokenV2Bot](https://t.me/DoaTokenV2Bot)  
- **GitHub:** [https://github.com/alimguz-ops/doa-token](https://github.com/alimguz-ops/doa-token)  

---

## ⚙️ Gobernanza y Operación / Governance & Operation
- **DoaTokenVotes:** Token con poder de voto / Voting power token.  
- **DoaGovernor:** Gobernanza de propuestas y ejecución / Governance of proposals & execution.  
- **TimelockController:** Delay de seguridad antes de ejecutar / Security delay before execution.  
- **AutomationCampaign + Scripts:** Ejecución automática de marketing y recompensas / Automated marketing & rewards execution.  

---

## 📊 Marketing Automatizado / Automated Marketing
- **Calendario JSON (30 días):** mensajes predefinidos con categoría y enlaces.  
- **Scripts PowerShell:**  
  - `publicar.ps1` → publica en Twitter, Telegram y Discord.  
  - `recompensas.ps1` → distribuye recompensas asociadas.  
  - `ejecutar-campania.ps1` → workflow maestro que ejecuta ambos en secuencia.  
- **Logs JSON:** cada acción queda registrada para auditoría.  

---

## 🔒 Robustez y Seguridad / Security & Robustness
- **Rate limits:** respetar límites de cada API.  
- **Seguridad:** credenciales en `.env`, nunca en código.  
- **Logs auditables:** cada publicación y recompensa se registra con fecha ISO.  
- **Automatización:** ejecución diaria con Task Scheduler (Windows) o cron (Linux).  

---

## 🚀 Cómo empezar / Getting Started
1. Clonar el repositorio / Clone the repository.  
2. Configurar `.env` con credenciales de X, Telegram y Discord.  
3. Definir `automation/calendario.json` con mensajes.  
4. Ejecutar `scripts/ejecutar-campania.ps1` o `node publicar.js`.  

---

## 📜 Licencia / License
Este proyecto está bajo licencia MIT. Consulta el archivo LICENSE para más detalles.  
This project is licensed under MIT. See LICENSE file for details.  

---

## 📘 Documentación completa / Full Documentation
Para más detalles técnicos, auditoría y gobernanza, consulta la documentación completa en:  
For full technical, audit, and governance details, see:  

➡️ [docs/README.md](docs/README.md)

---

<p align="center"><strong>Última actualización / Last update:</strong> Enero 2026 / January 2026</p>

Contrato (Polygon): 0x692d951163df3f7D9Fe071413F92c319D9B7369E
