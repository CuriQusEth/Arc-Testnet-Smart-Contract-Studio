import React, { useState } from 'react';
import { Copy, CheckCircle, RefreshCw, Info } from 'lucide-react';

export const AppKitSwap: React.FC = () => {
  const [tokenIn, setTokenIn] = useState('USDC');
  const [tokenOut, setTokenOut] = useState('EURC');
  const [amountIn, setAmountIn] = useState('10');
  const [slippage, setSlippage] = useState('300');
  const [customFee, setCustomFee] = useState('');
  const [feeRecipient, setFeeRecipient] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);
  const [txHash, setTxHash] = useState('');
  const [copied, setCopied] = useState(false);

  const generatedCode = `import { AppKit } from "@circle-fin/app-kit";
import { createViemAdapterFromPrivateKey } from "@circle-fin/adapter-viem-v2";

// Initialize App Kit
const kit = new AppKit();

// Setup Wallet Adapter (Viem example)
const adapter = createViemAdapterFromPrivateKey({ 
  privateKey: process.env.PRIVATE_KEY as string 
});

// Execute Swap
const result = await kit.swap({
  from: { adapter, chain: "Arc_Testnet" },
  tokenIn: "${tokenIn}",
  tokenOut: "${tokenOut}",
  amountIn: "${amountIn}",
  config: {
    kitKey: process.env.KIT_KEY as string,
    slippageBps: ${slippage}${customFee && feeRecipient ? `,
    fee: {
      amount: "${customFee}",
      recipient: "${feeRecipient}"
    }` : ''}
  }
});

console.log("Swap result:", result.txHash, result.explorerUrl);`;

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExecute = () => {
    setIsExecuting(true);
    setTxHash('');
    // Simulate API call
    setTimeout(() => {
      setIsExecuting(false);
      setTxHash('0x' + Array.from({length: 64}, () => Math.floor(Math.random()*16).toString(16)).join(''));
    }, 2000);
  };

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <RefreshCw className="w-5 h-5 text-blue-500" />
        <h2 className="text-lg font-semibold text-white">App Kit: Swap</h2>
      </div>
      
      <p className="text-sm text-gray-400 mb-6">
        Configure and generate a Node.js script to swap tokens natively using the Circle App Kit SDK.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">Chain</label>
            <select disabled className="w-full bg-gray-900 border border-gray-700 rounded-md px-3 py-2 text-sm text-gray-500 opacity-70 cursor-not-allowed">
              <option>Arc_Testnet</option>
            </select>
            <p className="text-[10px] text-gray-500 mt-1">Note: Among testnets, only Arc Testnet supports Swap.</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">Token In</label>
              <select 
                value={tokenIn} 
                onChange={(e) => {
                  setTokenIn(e.target.value);
                  if (e.target.value === tokenOut) {
                    setTokenOut(e.target.value === 'USDC' ? 'EURC' : 'USDC');
                  }
                }}
                className="w-full bg-gray-900 border border-gray-700 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
              >
                <option value="USDC">USDC</option>
                <option value="EURC">EURC</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">Token Out</label>
              <select 
                value={tokenOut} 
                onChange={(e) => {
                  setTokenOut(e.target.value);
                  if (e.target.value === tokenIn) {
                    setTokenIn(e.target.value === 'USDC' ? 'EURC' : 'USDC');
                  }
                }}
                className="w-full bg-gray-900 border border-gray-700 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
              >
                <option value="USDC">USDC</option>
                <option value="EURC">EURC</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">Amount In</label>
              <input
                type="number"
                value={amountIn}
                onChange={(e) => setAmountIn(e.target.value)}
                className="w-full bg-gray-900 border border-gray-700 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">Slippage (BPS)</label>
              <input
                type="number"
                value={slippage}
                onChange={(e) => setSlippage(e.target.value)}
                placeholder="300 = 3%"
                className="w-full bg-gray-900 border border-gray-700 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="bg-blue-900/20 border border-blue-800/50 rounded-md p-4 mt-4">
            <div className="flex items-start gap-2">
              <Info className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
              <div className="text-xs text-blue-200/80 space-y-1">
                <p><strong className="text-blue-300">Swap Fee Structure:</strong></p>
                <ul className="list-disc pl-4 space-y-0.5">
                  <li><strong>Provider Fee:</strong> 2 bps (0.02%)</li>
                  <li><strong>Custom Fee:</strong> Split 90% to your recipient, 10% to Arc.</li>
                </ul>
              </div>
            </div>
          </div>

          <button
            onClick={handleExecute}
            disabled={isExecuting || !amountIn}
            className="w-full mt-6 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isExecuting ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Processing Swap...
              </span>
            ) : (
              "Swap Tokens"
            )}
          </button>

          {txHash && (
            <div className="p-3 rounded-md text-sm bg-green-900/30 text-green-400 border border-green-800 mt-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                <span>Swap Initiated Successfully!</span>
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
              className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 transition-colors"
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
              npm install @circle-fin/app-kit @circle-fin/adapter-viem-v2 viem
            </code>
          </div>
        </div>
      </div>
    </div>
  );
};
