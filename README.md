# DOA Token Project

## Descripción
DOA es un token diseñado para gobernanza, liquidez y expansión de aplicaciones descentralizadas.

## Características principales
- Contrato proxy para actualizaciones seguras.
- Scripts de monitoreo de liquidez.
- Auditoría externa pendiente.
- Documentación legal AML/KYC en proceso.

## Estructura del repositorio
- `contracts/` → contratos inteligentes.
- `scripts/` → automatización y monitoreo.
- `deployments/` → registros de despliegue.
- `docs/` → documentación general.
- `audit/` → auditoría externa.
- `legal/` → compliance.
- `app/` → módulos de utilidad.
- `cex-application/` → aplicación a exchanges.lo hice dime explicame como abrirlos donde y como reescribirlos
# Documentación DOA

## Índice

- [Liquidez en Uniswap v3](liquidez-uniswap-v3.md)
- [Cumplimiento legal](legal/compliance.md)
- [Auditoría externa](legal/audit-report.md)
- [Gobernanza](governance.md)
- [Roadmap](roadmap.md)

Contrato (Polygon): 0x692d951163df3f7D9Fe071413F92c319D9B7369E


DOA Token V2

📌 Introducción

DOA Token V2 es un proyecto autosostenible que combina gobernanza, marketing automatizado y distribución de recompensas. Su objetivo es ofrecer transparencia, participación comunitaria y robustez operativa.

🌐 Ecosistema

Contrato en Polygonscan: 0x692d951163df3f7D9Fe071413F92c319D9B7369E

Repositorio operativo (GitHub): alimguz-ops/doa-token

Tokenomics: TOKENOMICS.md

📢 Redes oficiales

Discord (comunidad oficial): https://discord.gg/TCXB69cm

Twitter/X (oficial): https://x.com/DoaV270493

Telegram (comunidad): https://t.me/DoaTokenV2Bot oficial: @DoaTokenV2bot

GitHub (repositorio): https://github.com/alimguz-ops/doa-token

⚙️ Gobernanza y Operación

DoaTokenVotes → Token con poder de voto.

DoaGovernor → Gobernanza de propuestas, votaciones y ejecución.

TimelockController → Delay de seguridad antes de ejecutar.

AutomationCampaign + Scripts → Ejecución automática de marketing y recompensas.

📊 Marketing Automatizado

Calendario JSON (30 días): mensajes predefinidos con categoría y enlaces.

Scripts PowerShell:

publicar.ps1 → publica en Twitter, Telegram y Discord.

recompensas.ps1 → distribuye recompensas asociadas.

ejecutar-campania.ps1 → workflow maestro que ejecuta ambos en secuencia.

Logs JSON: cada acción queda registrada para auditoría.

🔒 Robustez y Seguridad

Rate limits: respetar límites de cada API.

Seguridad: credenciales en .env, nunca en código.

Logs auditables: cada publicación y recompensa se registra con fecha ISO.

Automatización: programar ejecución diaria con Task Scheduler (Windows) o cron (Linux).

🚀 Cómo empezar

Clonar el repositorio.

Configurar .env con credenciales de X, Telegram y Discord.

Definir automation/calendario.json con mensajes.

Ejecutar scripts/ejecutar-campania.ps1 o node publicar.js.

📜 Licencia

Este proyecto está bajo licencia MIT. Consulta el archivo LICENSE para más detalles.