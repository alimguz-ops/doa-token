---
layout: default
title: Brand Guidelines – DOA Token V2
---

# 🎨 Brand Guidelines – DOA Token V2  
# 🎨 Guías de Marca – DOA Token V2

Este documento define los lineamientos oficiales de identidad visual para el ecosistema DOA Token V2.  
This document defines the official visual identity guidelines for the DOA Token V2 ecosystem.  

---

## 🖼 Archivos de Marca / Brand Assets

- **doa.svg** → Logo principal dorado con fondo transparente.  
- **doa-dark.svg** → Versión con fondo oscuro.  
- **doa-flat.svg** → Versión dorada plana (sin gradiente).  
- **doa-mask.svg** → Versión en negro, para usar como máscara en CSS.  

---

## 🎨 Paleta de Colores / Color Palette

- **Dorado / Gold:** `#FFD700`  
- **Negro / Black:** `#000000`  
- **Blanco / White:** `#FFFFFF`  
- **Gris neutro / Neutral Gray:** `#808080`  

Uso recomendado:  
- Dorado → Identidad principal, títulos, íconos.  
- Negro → Fondos oscuros, tipografía.  
- Blanco → Fondos claros, contraste.  
- Gris → Elementos secundarios, bordes, fondos neutros.  

---

## ✍️ Tipografía / Typography

- **Primaria / Primary:** `Roboto` (Sans-serif)  
- **Secundaria / Secondary:** `Montserrat` (Sans-serif, títulos destacados)  

Uso recomendado:  
- Roboto → Texto corrido, documentación, interfaces.  
- Montserrat → Encabezados, títulos, material promocional.  

---

## ✅ Usos Correctos / Correct Usage

- Mantener proporciones originales del logo.  
- Usar fondo transparente o colores oficiales.  
- Respetar la paleta de colores definida.  
- Incluir margen mínimo de 16px alrededor del logo.  

---

## ❌ Usos Incorrectos / Incorrect Usage

- No distorsionar ni estirar el logo.  
- No cambiar colores fuera de la paleta oficial.  
- No usar sombras, efectos 3D o gradientes no oficiales.  
- No colocar el logo sobre fondos que dificulten su legibilidad.  

---

## ⚙️ Workflow CI/CD

Archivo / File: `.github/workflows/brand.yml`  
- Convierte automáticamente los SVG en PNG de distintos tamaños (256px, 128px) cada vez que se actualizan.  
- Automatically converts SVG files into PNGs of different sizes (256px, 128px) whenever updated.  

---

## 💻 Uso en Frontend / Frontend Usage

Ejemplo en React/Next.js:  
```tsx
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
