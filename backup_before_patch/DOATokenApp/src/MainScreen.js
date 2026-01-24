import React, { useState } from "react";
import { View, Button, Text, TextInput, Alert, StyleSheet } from "react-native";
import { useWalletConnect } from "@walletconnect/react-native-dapp";
import { ethers } from "ethers";
import { tokenContract } from "./token";

export default function MainScreen() {
  const connector = useWalletConnect();
  const [toAddress, setToAddress] = useState("");
  const [amount, setAmount] = useState("");

  const connectWallet = () => {
    if (!connector.connected) {
      connector.connect();
    }
  };

  const sendTokens = async () => {
    try {
      if (!ethers.isAddress(toAddress)) {
        Alert.alert("Dirección inválida");
        return;
      }
      if (!amount || isNaN(Number(amount))) {
        Alert.alert("Cantidad inválida");
        return;
      }

      const provider = new ethers.providers.Web3Provider(connector);
      const signer = await provider.getSigner();
      const contractWithSigner = tokenContract.connect(signer);

      const tx = await contractWithSigner.transfer(toAddress, ethers.parseUnits(amount, 18));
      Alert.alert("Transacción enviada", `Hash: ${tx.hash}`);
    } catch (err) {
      console.error("Error al enviar tokens:", err);
      Alert.alert("Error", "No se pudo enviar la transacción");
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Conectar Wallet" onPress={connectWallet} />
      {connector.connected && (
        <View style={styles.block}>
          <Text style={styles.label}>Wallet conectada:</Text>
          <Text style={styles.value}>{connector.accounts[0]}</Text>

          <TextInput
            style={styles.input}
            placeholder="Dirección destino"
            value={toAddress}
            onChangeText={setToAddress}
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            placeholder="Cantidad DOA"
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
          />
          <Button title="Enviar DOA" onPress={sendTokens} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  block: { marginTop: 20 },
  label: { fontSize: 16, fontWeight: "600" },
  value: { fontSize: 14, marginBottom: 10 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginTop: 10,
    marginBottom: 10,
    borderRadius: 8,
  },
});