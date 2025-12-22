# Crear estructura de carpetas
New-Item -ItemType Directory -Force -Path "D:\doa-token\apps\web\public\brand\doa"
New-Item -ItemType Directory -Force -Path "D:\doa-token\.github\workflows"
New-Item -ItemType Directory -Force -Path "D:\doa-token\apps\web\src\components"

# =========================
# doa.svg (principal dorado)
# =========================
@"
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <defs>
    <linearGradient id="gold" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#FFE085"/>
      <stop offset="50%" stop-color="#FFC84D"/>
      <stop offset="100%" stop-color="#D69C2F"/>
    </linearGradient>
  </defs>
  <g transform="translate(12,12)">
    <path d="M 10 8 L 10 66 C 10 80 23 88 40 88 C 57 88 70 80 70 66 C 70 53 58 46 41 46 L 32 46 C 49 46 64 36 64 23 C 64 11 51 8 35 8 Z" fill="url(#gold)"/>
    <circle cx="38" cy="34" r="12" fill="url(#gold)"/>
    <path d="M 54 12 L 72 66 L 64 66 L 57 49 L 49 66 L 41 66 L 54 12 Z" fill="url(#gold)"/>
  </g>
  <text x="50" y="95" font-family="sans-serif" font-size="9" text-anchor="middle" fill="url(#gold)">DOA</text>
</svg>
"@ | Set-Content "D:\doa-token\apps\web\public\brand\doa\doa.svg"

# =========================
# doa-dark.svg (fondo oscuro)
# =========================
@"
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <defs>
    <linearGradient id="gold" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#FFE085"/>
      <stop offset="50%" stop-color="#FFC84D"/>
      <stop offset="100%" stop-color="#D69C2F"/>
    </linearGradient>
  </defs>
  <rect x="0" y="0" width="100" height="100" fill="#0E1320"/>
  <g transform="translate(12,12)">
    <path d="M 10 8 L 10 66 C 10 80 23 88 40 88 C 57 88 70 80 70 66 C 70 53 58 46 41 46 L 32 46 C 49 46 64 36 64 23 C 64 11 51 8 35 8 Z" fill="url(#gold)"/>
    <circle cx="38" cy="34" r="12" fill="url(#gold)"/>
    <path d="M 54 12 L 72 66 L 64 66 L 57 49 L 49 66 L 41 66 L 54 12 Z" fill="url(#gold)"/>
  </g>
  <text x="50" y="95" font-family="sans-serif" font-size="9" text-anchor="middle" fill="url(#gold)">DOA</text>
</svg>
"@ | Set-Content "D:\doa-token\apps\web\public\brand\doa\doa-dark.svg"

# =========================
# doa-flat.svg (plano sin gradiente)
# =========================
@"
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <g transform="translate(12,12)" fill="#FFC84D">
    <path d="M 10 8 L 10 66 C 10 80 23 88 40 88 C 57 88 70 80 70 66 C 70 53 58 46 41 46 L 32 46 C 49 46 64 36 64 23 C 64 11 51 8 35 8 Z"/>
    <circle cx="38" cy="34" r="12"/>
    <path d="M 54 12 L 72 66 L 64 66 L 57 49 L 49 66 L 41 66 L 54 12 Z"/>
  </g>
  <text x="50" y="95" font-family="sans-serif" font-size="9" text-anchor="middle" fill="#FFC84D">DOA</text>
</svg>
"@ | Set-Content "D:\doa-token\apps\web\public\brand\doa\doa-flat.svg"

# =========================
# doa-mask.svg (solo forma negra)
# =========================
@"
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <g transform="translate(12,12)" fill="#000">
    <path d="M 10 8 L 10 66 C 10 80 23 88 40 88 C 57 88 70 80 70 66 C 70 53 58 46 41 46 L 32 46 C 49 46 64 36 64 23 C 64 11 51 8 35 8 Z"/>
    <circle cx="38" cy="34" r="12"/>
    <path d="M 54 12 L 72 66 L 64 66 L 57 49 L 49 66 L 41 66 L 54 12 Z"/>
  </g>
  <text x="50" y="95" font-family="sans-serif" font-size="9" text-anchor="middle" fill="#000">DOA</text>
</svg>
"@ | Set-Content "D:\doa-token\apps\web\public\brand\doa\doa-mask.svg"

# =========================
# Workflow brand.yml
# =========================
@"
name: Build DOA icons
on:
  push:
    paths:
      - "apps/web/public/brand/doa/*.svg"

jobs:
  render-icons:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm i -g sharp-cli
      - run: |
          npx sharp-cli apps/web/public/brand/doa/doa.svg --resize 256 --output apps/web/public/brand/doa/doa-256.png
          npx sharp-cli apps/web/public/brand/doa/doa.svg --resize 128 --output apps/web/public/brand/doa/doa-128.png
"@ | Set-Content "D:\doa-token\.github\workflows\brand.yml"

# =========================
# Componente React TokenLogo.tsx
# =========================
@"
import Image from "next/image";

export function TokenLogo() {
  return (
    <Image
      src="/brand/doa/doa.svg"
      width={64}
      height={64}
      alt="DOA token"
    />
  );
}
"@ | Set-Content "D:\doa-token\apps\web\src\components\TokenLogo.tsx"

# =========================
# Crear ZIP final
# =========================
Compress-Archive -Path "D:\doa-token" -DestinationPath "D:\doa-token.zip" -Force
