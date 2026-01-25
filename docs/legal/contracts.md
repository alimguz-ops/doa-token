---
layout: default
title: contracts
---

# 📜 DOA Token – Contracts Register  
# 📜 DOA Token – Registro de Contratos

Este documento centraliza y describe todos los contratos asociados al ecosistema DOA Token.  
Incluye contratos inteligentes desplegados en blockchain y contratos legales vinculados al proyecto.  
This document centralizes and describes all contracts associated with the DOA Token ecosystem.  
It includes smart contracts deployed on blockchain and legal contracts linked to the project.  

---

## 📋 Contratos Inteligentes / Smart Contracts

- **Token Contract (ERC-20):**  
  - Dirección / Address: `0x692d951163df3f7D9Fe071413F92c319D9B7369E`  
  - Funciones principales / Main functions: `transfer`, `burn`, `mint`, `approve`.  
  - Proxy: registrado en `deployments.json`. / registered in `deployments.json`.  
  - Auditoría / Audit: documentada en `audit-report.md`.  

- **Liquidity Pool Contract:**  
  - Dirección / Address: [por definir tras deploy / to be defined after deploy]  
  - Funciones principales / Main functions: añadir/remover liquidez, gestión de reservas. / add/remove liquidity, reserve management.  
  - Monitoreo / Monitoring: `monitor-liquidez.js`.  

- **Governance Contract:**  
  - Dirección / Address: [por definir tras deploy / to be defined after deploy]  
  - Funciones principales / Main functions: creación de propuestas, votación, ejecución de decisiones. / proposal creation, voting, decision execution.  
  - Documentación / Documentation: `governance.md`, `proposals.md`, `governance-log.md`.  

---

## 📋 Contratos Legales / Legal Contracts

- **Certificación de No-Valor / Non-Security Certification:**  
  - Documento / Document: `legal/certification.md`.  
  - Alcance / Scope: confirma que el DOA Token no constituye un valor financiero. / confirms that DOA Token does not constitute a financial security.  

- **Políticas AML/KYC / AML/KYC Policies:**  
  - Documento / Document: `legal/AML-KYC.md`.  
  - Alcance / Scope: define procedimientos de prevención de lavado de dinero y verificación de identidad. / defines anti-money laundering and identity verification procedures.  

- **Jurisdicciones / Jurisdictions:**  
  - Documento / Document: `legal/jurisdictions.md`.  
  - Alcance / Scope: registro de cumplimiento regulatorio por país. / record of regulatory compliance by country.  

---

## 📑 Ejemplo de Entrada / Example Entry

- **Contrato / Contract:** Token Contract (ERC-20)  
- **Dirección / Address:** `0x692d951163df3f7D9Fe071413F92c319D9B7369E`  
- **Estado / Status:** activo / active  
- **Auditoría / Audit:** CertiK – 2025-12-20  
- **Notas / Notes:** Optimización aplicada en función `transfer` tras hallazgos menores. / Optimization applied in `transfer` function after minor findings.  

---

## 📌 Notas / Notes
- Este archivo debe actualizarse cada vez que se despliegue un nuevo contrato o se firme un contrato legal.  
- This file must be updated each time a new contract is deployed or a legal contract is signed.  

- Complementa `audit-report.md`, `compliance.md` y `governance.md`.  
- This file complements `audit-report.md`, `compliance.md`, and `governance.md`.  

- La transparencia en contratos fortalece la confianza de la comunidad y exchanges.  
- Transparency in contracts strengthens community and exchange trust.  

---

<p align="center"><strong>Última actualización / Last update:</strong> Enero 2026</p>
