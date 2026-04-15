import { createEthersAdapterFromProvider } from "@circle-fin/adapter-ethers-v6";
import type { Eip1193Provider } from "ethers";

declare global {
  interface Window {
    ethereum?: Eip1193Provider;
  }
}

export async function createBrowserAdapter() {
  if (!window.ethereum) {
    throw new Error("Cüzdan bulunamadı. MetaMask veya Zerion yükleyin.");
  }

  // ✅ window.ethereum'a property tanımlamıyor — isZerion hatası olmaz
  const adapter = await createEthersAdapterFromProvider({
    provider: window.ethereum,
  });

  return adapter;
}
