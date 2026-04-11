import React from 'react';
import { useWeb3 } from '../context/Web3Context';
import { Wallet, LogOut, AlertCircle } from 'lucide-react';

export const WalletConnect: React.FC = () => {
  const { address, ethBalance, usdcBalance, connectWallet, disconnectWallet, chainId, ensureArcTestnet } = useWeb3();

  const truncateAddress = (addr: string) => {
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
  };

  return (
    <div className="flex items-center justify-between p-4 bg-gray-900 border-b border-gray-800">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
          <Wallet className="w-4 h-4 text-white" />
        </div>
        <h1 className="text-xl font-bold text-white tracking-tight">Arc Studio</h1>
      </div>

      <div>
        {!address ? (
          <button
            onClick={connectWallet}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition-colors"
          >
            Connect Wallet
          </button>
        ) : (
          <div className="flex items-center gap-4">
            {chainId !== 1051 && (
              <button 
                onClick={ensureArcTestnet}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-red-900/40 text-red-400 hover:bg-red-900/60 rounded-md text-xs font-medium border border-red-800/50 transition-colors"
              >
                <AlertCircle className="w-3.5 h-3.5" />
                Wrong Network
              </button>
            )}
            
            <div className="flex items-center gap-3 bg-gray-800 px-3 py-1.5 rounded-md border border-gray-700">
              <div className="flex flex-col text-xs text-gray-400">
                <span>{Number(ethBalance)?.toFixed(4)} ETH</span>
                <span>{Number(usdcBalance)?.toFixed(2)} USDC</span>
              </div>
              <div className="h-6 w-px bg-gray-700"></div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm font-mono text-gray-200">{truncateAddress(address)}</span>
              </div>
            </div>
            
            <button
              onClick={disconnectWallet}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-md transition-colors"
              title="Disconnect"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
