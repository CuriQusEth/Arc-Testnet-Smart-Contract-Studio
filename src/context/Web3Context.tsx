import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ethers } from 'ethers';

declare global {
  interface Window {
    ethereum?: any;
  }
}

interface Transaction {
  hash: string;
  type: string;
  timestamp: number;
  status: 'pending' | 'confirmed' | 'failed';
}

interface Web3ContextType {
  provider: ethers.BrowserProvider | null;
  signer: ethers.JsonRpcSigner | null;
  address: string | null;
  chainId: number | null;
  ethBalance: string | null;
  usdcBalance: string | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  switchToArcTestnet: () => Promise<void>;
  ensureArcTestnet: () => Promise<void>;
  transactions: Transaction[];
  addTransaction: (tx: Transaction) => void;
  updateTransaction: (hash: string, status: 'confirmed' | 'failed') => void;
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined);

const ARC_TESTNET_CHAIN_ID = 1051;
const ARC_TESTNET_CHAIN_ID_HEX = '0x41B';
const USDC_ADDRESS = '0x3600000000000000000000000000000000000000';

const usdcAbi = [
  "function balanceOf(address owner) view returns (uint256)"
];

export const Web3Provider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.JsonRpcSigner | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);
  const [ethBalance, setEthBalance] = useState<string | null>(null);
  const [usdcBalance, setUsdcBalance] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const addTransaction = (tx: Transaction) => {
    setTransactions(prev => [tx, ...prev].slice(0, 50));
  };

  const updateTransaction = (hash: string, status: 'confirmed' | 'failed') => {
    setTransactions(prev => prev.map(tx => tx.hash === hash ? { ...tx, status } : tx));
  };

  const fetchBalances = async (prov: ethers.BrowserProvider, addr: string) => {
    try {
      const balance = await prov.getBalance(addr);
      setEthBalance(ethers.formatEther(balance));

      const usdcContract = new ethers.Contract(USDC_ADDRESS, usdcAbi, prov);
      const usdcBal = await usdcContract.balanceOf(addr);
      setUsdcBalance(ethers.formatUnits(usdcBal, 6)); // Assuming 6 decimals for USDC
    } catch (error) {
      console.error("Error fetching balances:", error);
    }
  };

  const switchToArcTestnet = async () => {
    if (!window.ethereum) return;
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: ARC_TESTNET_CHAIN_ID_HEX }]
      });
    } catch (error: any) {
      // 4902 = chain not added yet
      if (error.code === 4902) {
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [{
              chainId: ARC_TESTNET_CHAIN_ID_HEX,
              chainName: "Arc Testnet",
              nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
              rpcUrls: ["https://rpc.testnet.arc.network"],
              blockExplorerUrls: ["https://testnet.arcscan.app"]
            }]
          });
        } catch (addError) {
          console.error("Failed to add Arc Testnet", addError);
          throw addError;
        }
      } else {
        console.error("Failed to switch to Arc Testnet", error);
        throw error;
      }
    }
  };

  const ensureArcTestnet = async () => {
    if (!window.ethereum) return;
    const currentChainId = await window.ethereum.request({ method: "eth_chainId" });
    if (currentChainId.toLowerCase() !== ARC_TESTNET_CHAIN_ID_HEX.toLowerCase()) {
      await switchToArcTestnet();
    }
  };

  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        await ensureArcTestnet();
        
        const prov = new ethers.BrowserProvider(window.ethereum);
        const sig = await prov.getSigner();
        const addr = await sig.getAddress();
        const network = await prov.getNetwork();
        
        setProvider(prov);
        setSigner(sig);
        setAddress(addr);
        setChainId(Number(network.chainId));
        
        await fetchBalances(prov, addr);
        
        // Setup listeners
        window.ethereum.on('accountsChanged', (accounts: string[]) => {
          if (accounts.length > 0) {
            setAddress(accounts[0]);
            fetchBalances(prov, accounts[0]);
          } else {
            disconnectWallet();
          }
        });

        window.ethereum.on('chainChanged', (chainIdHex: string) => {
          window.location.reload();
        });

      } catch (error) {
        console.error("User rejected connection or error occurred:", error);
      }
    } else {
      alert("Please install MetaMask!");
    }
  };

  const disconnectWallet = () => {
    setProvider(null);
    setSigner(null);
    setAddress(null);
    setChainId(null);
    setEthBalance(null);
    setUsdcBalance(null);
  };

  return (
    <Web3Context.Provider value={{
      provider, signer, address, chainId, ethBalance, usdcBalance,
      connectWallet, disconnectWallet, switchToArcTestnet, ensureArcTestnet, transactions, addTransaction, updateTransaction
    }}>
      {children}
    </Web3Context.Provider>
  );
};

export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (context === undefined) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
};
