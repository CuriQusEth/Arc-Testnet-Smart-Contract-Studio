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
        Swap tokens natively on Arc Testnet.
      </p>

      <div className="max-w-xl space-y-4">
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
    </div>
  );
};
