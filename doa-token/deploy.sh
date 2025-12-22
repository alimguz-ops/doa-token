#!/usr/bin/env bash
set -euo pipefail

SCRIPT="scripts/deployPreSale.js"

deploy_polygon() {
  echo "🚀 Deploy: Polygon mainnet"
  npx hardhat run "$SCRIPT" --network polygon
}

deploy_mumbai() {
  echo "🚀 Deploy: Polygon Mumbai testnet"
  npx hardhat run "$SCRIPT" --network polygonMumbai
}

deploy_amoy() {
  echo "🚀 Deploy: Polygon Amoy testnet"
  npx hardhat run "$SCRIPT" --network amoy
}

case "${1:-}" in
  polygon)
    deploy_polygon
    ;;
  mumbai)
    deploy_mumbai
    ;;
  amoy)
    deploy_amoy
    ;;
  *)
    echo "Uso: ./deploy.sh [polygon|mumbai|amoy]"
    exit 1
    ;;
esac
