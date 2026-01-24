---
layout: default
title: tabla-equivalencias-v5-v6
---
Función / Objeto v5	Equivalente en v6	Nota práctica
ethers.providers.JsonRpcProvider	ethers.JsonRpcProvider	Se eliminó el namespace providers.
ethers.utils.formatUnits(value, d)	ethers.formatUnits(value, d)	utils ya no existe, todo está en la raíz.
ethers.utils.parseUnits(value, d)	ethers.parseUnits(value, d)	Igual que arriba.
ethers.utils.getAddress(addr)	ethers.getAddress(addr)	Validación de direcciones.
ethers.utils.Interface(abi)	new ethers.Interface(abi)	Ahora es clase directa.
ethers.utils.keccak256(data)	ethers.keccak256(data)	Hash directo.
ethers.utils.toUtf8String(bytes)	ethers.toUtf8String(bytes)	Conversión de strings.
ethers.utils.hexlify(data)	ethers.hexlify(data)	Hex utils siguen igual pero sin utils.
