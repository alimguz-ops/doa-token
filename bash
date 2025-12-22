#!/usr/bin/env bash
set -euo pipefail

# --- Configuración ---
SCRIPT="scripts/deployPreSale.js"

# --- Funciones ---
deploy_polygon() {
  echo "🚀 Desplegando en Polygon mainnet..."
  npx hardhat run "$SCRIPT" --network polygon
}

deploy_mumbai() {
  echo "🚀 Desplegando en Polygon Mumbai testnet..."
  npx hardhat run "$SCRIPT" --network polygonMumbai
}

# --- Selector ---
case "${1:-}" in
  polygon)
    deploy_polygon
    ;;
  mumbai)
    deploy_mumbai
    ;;
  *)
    echo "Uso: ./deploy.sh [polygon|mumbai]"
    exit 1
    ;;
esac
