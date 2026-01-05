#!/bin/sh
# lock-env.sh
# Genera o actualiza el candado .env.lock con el hash SHA256 del archivo .env

if [ ! -f ".env" ]; then
  echo "❌ No existe archivo .env en la raíz del proyecto."
  exit 1
fi

# Calcular hash SHA256 del .env
HASH=$(sha256sum .env | awk '{print $1}')

# Guardar hash en .env.lock
echo "HASH=$HASH" > .env.lock

echo "✅ Candado actualizado: .env.lock contiene el hash $HASH"
