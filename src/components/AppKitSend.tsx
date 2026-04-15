import React, { useState } from 'react';
import { Copy, CheckCircle, Send as SendIcon, Info } from 'lucide-react';

const CHAINS = ['Ethereum_Sepolia', 'Arc_Testnet', 'Base_Sepolia', 'Avalanche_Fuji'];
const TOKENS = ['USDC', 'EURC', 'USDT', 'USDe', 'DAI', 'PYUSD', 'NATIVE', 'Custom Address'];

export const AppKitSend: React.FC = () => {
  const [chain, setChain] = useState('Arc_Testnet');
  const [token, setToken] = useState('USDC');
  const [customToken, setCustomToken] = useState('');
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('10');
  const [isExecuting, setIsExecuting] = useState(false);
  const [txHash, setTxHash] = useState('');
  const [adapter, setAdapter] = useState<'viem' | 'ethers' | 'circle'>('viem');
  const [copied, setCopied] = useState(false);

  const activeToken = token === 'Custom Address' ? customToken : token;

  const getAdapterImport = () => {
    if (adapter === 'viem') return `import { createViemAdapterFromPrivateKey } from "@circle-fin/adapter-viem-v2";`;
    if (adapter === 'ethers') return `import { createEthersAdapterFromPrivateKey } from "@circle-fin/adapter-ethers-v6";`;
    return `import { createCircleWalletAdapter } from "@circle-fin/adapter-circle-wallets";`;
  };

  const getAdapterInit = () => {
    if (adapter === 'viem') return `const adapter = createViemAdapterFromPrivateKey({ privateKey: process.env.PRIVATE_KEY as string });`;
    if (adapter === 'ethers') return `const adapter = createEthersAdapterFromPrivateKey({ privateKey: process.env.PRIVATE_KEY as string });`;
    return `const adapter = createCircleWalletAdapter({ walletId: process.env.WALLET_ID as string });`;
  };

  const getInstallCommand = () => {
    const base = 'npm install @circle-fin/app-kit';
    if (adapter === 'viem') return `${base} @circle-fin/adapter-viem-v2 viem`;
    if (adapter === 'ethers') return `${base} @circle-fin/adapter-ethers-v6 ethers`;
    return `${base} @circle-fin/adapter-circle-wallets`;
  };

  const generatedCode = `import { AppKit } from "@circle-fin/app-kit";
${getAdapterImport()}

// Initialize App Kit
const kit = new AppKit();

// Setup Wallet Adapter
${getAdapterInit()}

// Execute Send
const result = await kit.send({
  from: { adapter, chain: "${chain}" },
  to: "${recipient || '0x...'}",
  amount: "${amount}",
  token: "${activeToken || 'USDC'}",
});

console.log("Send TX:", result.txHash, result.explorerUrl);`;

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExecute = async () => {
    setIsExecuting(true);
    setTxHash('');
    try {
      const { AppKit } = await import('@circle-fin/app-kit');
      const { createBrowserAdapter } = await import('../lib/adapter');
      
      const kit = new AppKit();
      const browserAdapter = await createBrowserAdapter();
      
      const result = await kit.send({
        from: { adapter: browserAdapter, chain: chain },
        to: recipient,
        amount: amount,
        token: activeToken || 'USDC',
      });
      
      setTxHash(result.txHash || 'Success');
    } catch (error: any) {
      console.error("Send error:", error);
      alert(`Error: ${error.message}`);
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <SendIcon className="w-5 h-5 text-green-500" />
        <h2 className="text-lg font-semibold text-white">App Kit: Send</h2>
      </div>
      
      <p className="text-sm text-gray-400 mb-6">
        Configure and generate a Node.js script to send tokens using the Circle App Kit SDK.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">Chain</label>
              <select 
                value={chain} 
                onChange={(e) => setChain(e.target.value)}
                className="w-full bg-gray-900 border border-gray-700 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-green-500"
              >
                {CHAINS.map(c => <option key={c} value={c}>{c.replace('_', ' ')}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">Token</label>
              <select 
                value={token} 
                onChange={(e) => setToken(e.target.value)}
                className="w-full bg-gray-900 border border-gray-700 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-green-500"
              >
                {TOKENS.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>

          {token === 'Custom Address' && (
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">Custom Token Address</label>
              <input
                type="text"
                value={customToken}
                onChange={(e) => setCustomToken(e.target.value)}
                placeholder="0x..."
                className="w-full bg-gray-900 border border-gray-700 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-green-500"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">Recipient Address</label>
            <input
              type="text"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="0x..."
              className="w-full bg-gray-900 border border-gray-700 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-green-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">Amount</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-gray-900 border border-gray-700 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-green-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-400 mb-2">Wallet Adapter</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
                <input 
                  type="radio" 
                  checked={adapter === 'viem'} 
                  onChange={() => setAdapter('viem')}
                  className="text-green-500 focus:ring-green-500 bg-gray-900 border-gray-700"
                />
                Viem
              </label>
              <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
                <input 
                  type="radio" 
                  checked={adapter === 'ethers'} 
                  onChange={() => setAdapter('ethers')}
                  className="text-green-500 focus:ring-green-500 bg-gray-900 border-gray-700"
                />
                Ethers
              </label>
              <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
                <input 
                  type="radio" 
                  checked={adapter === 'circle'} 
                  onChange={() => setAdapter('circle')}
                  className="text-green-500 focus:ring-green-500 bg-gray-900 border-gray-700"
                />
                Circle Wallets
              </label>
            </div>
          </div>

          <div className="bg-blue-900/20 border border-blue-800/50 rounded-md p-4 mt-4">
            <div className="flex items-start gap-2">
              <Info className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
              <div className="text-xs text-blue-200/80 space-y-1">
                <p><strong className="text-blue-300">Token Aliases:</strong></p>
                <p>You can use standard aliases like USDC, EURC, USDT, USDe, DAI, PYUSD, or NATIVE. The SDK will automatically resolve these to the correct contract addresses on the selected chain.</p>
              </div>
            </div>
          </div>

          <button
            onClick={handleExecute}
            disabled={isExecuting || !amount || !recipient}
            className="w-full mt-6 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-medium py-2.5 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isExecuting ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Processing Send...
              </span>
            ) : (
              "Send Tokens"
            )}
          </button>

          {txHash && (
            <div className="p-3 rounded-md text-sm bg-green-900/30 text-green-400 border border-green-800 mt-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                <span>Send Initiated Successfully!</span>
              </div>
              <div className="mt-2 text-xs font-mono break-all text-gray-300">
                TX Hash: {txHash}
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs font-medium text-gray-400">Generated TypeScript</label>
            <button 
              onClick={handleCopy}
              className="flex items-center gap-1 text-xs text-green-400 hover:text-green-300 transition-colors"
            >
              {copied ? <CheckCircle className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              {copied ? 'Copied!' : 'Copy Code'}
            </button>
          </div>
          <div className="relative flex-1 bg-[#0d1117] rounded-md border border-gray-700 overflow-hidden">
            <pre className="absolute inset-0 p-4 overflow-auto text-xs font-mono text-gray-300 custom-scrollbar">
              <code>{generatedCode}</code>
            </pre>
          </div>
          <div className="mt-3 bg-gray-900 border border-gray-700 rounded-md p-3">
            <label className="block text-xs font-medium text-gray-500 mb-1">Install Dependencies</label>
            <code className="text-xs text-green-400 font-mono select-all">
              {getInstallCommand()}
            </code>
          </div>
        </div>
      </div>
    </div>
  );
};
