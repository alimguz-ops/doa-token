// src/WalletProvider.tsx
import React, { ReactNode } from "react";
import { WalletConnectProvider } from "@walletconnect/react-native-dapp";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface Props {
  children: ReactNode;
}

export default function WalletProvider({ children }: Props) {
  return (
    <WalletConnectProvider
      redirectUrl={"doatokenapp://"} // ← reemplaza con tu esquema real si usas deep linking
      storageOptions={{ asyncStorage: AsyncStorage }}
    >
      {children}
    </WalletConnectProvider>
  );
}