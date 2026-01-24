# Scripts del Proyecto DOA

Esta carpeta contiene los scripts de automatización y monitoreo utilizados en el despliegue y operación del token **DOA**.  
Su objetivo es facilitar tareas críticas como despliegue de contratos, validación de liquidez y utilidades comunes para auditar y mantener el ecosistema.

## Archivos incluidos
- **deploy.js** → Script de despliegue automático del contrato en la red configurada.
- **monitor-liquidez.js** → Script de monitoreo de reservas mínimas y alertas de liquidez en DEX.
- **utils.js** → Funciones auxiliares compartidas entre los distintos scripts.

## Requisitos
- Node.js >= 18
- Hardhat configurado en el proyecto
- Archivo `.env` con las credenciales y RPCs necesarios

## Ejecución
```bash
# Desplegar contrato
npx hardhat run scripts/deploy.js --network polygon

# Monitorear liquidez
node scripts/monitor-liquidez.js