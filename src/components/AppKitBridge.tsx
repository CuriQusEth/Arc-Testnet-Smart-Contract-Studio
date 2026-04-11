import React, { useState } from 'react';
import { Copy, CheckCircle, ArrowRightLeft, Info } from 'lucide-react';

const CHAINS = ['Ethereum_Sepolia', 'Arc_Testnet', 'Base_Sepolia', 'Avalanche_Fuji'];

export const AppKitBridge: React.FC = () => {
  const [fromChain, setFromChain] = useState('Ethereum_Sepolia');
  const [toChain, setToChain] = useState('Arc_Testnet');
  const [amount, setAmount] = useState('10');
  const [speed, setSpeed] = useState<'FAST' | 'SLOW'>('FAST');
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
        <ArrowRightLeft className="w-5 h-5 text-purple-500" />
        <h2 className="text-lg font-semibold text-white">App Kit: Bridge</h2>
      </div>
      
      <p className="text-sm text-gray-400 mb-6">
        Bridge USDC across chains seamlessly.
      </p>

      <div className="max-w-xl space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">From Chain</label>
              <select 
                value={fromChain} 
                onChange={(e) => setFromChain(e.target.value)}
                className="w-full bg-gray-900 border border-gray-700 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500"
              >
                {CHAINS.map(c => <option key={c} value={c}>{c.replace('_', ' ')}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">To Chain</label>
              <select 
                value={toChain} 
                onChange={(e) => setToChain(e.target.value)}
                className="w-full bg-gray-900 border border-gray-700 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500"
              >
                {CHAINS.map(c => <option key={c} value={c}>{c.replace('_', ' ')}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">Amount (USDC)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-gray-900 border border-gray-700 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-400 mb-2">Transfer Speed</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
                <input 
                  type="radio" 
                  name="speed" 
                  checked={speed === 'FAST'} 
                  onChange={() => setSpeed('FAST')}
                  className="text-purple-500 focus:ring-purple-500 bg-gray-900 border-gray-700"
                />
                FAST (1-14 bps fee)
              </label>
              <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
                <input 
                  type="radio" 
                  name="speed" 
                  checked={speed === 'SLOW'} 
                  onChange={() => setSpeed('SLOW')}
                  className="text-purple-500 focus:ring-purple-500 bg-gray-900 border-gray-700"
                />
                SLOW (0% fee)
              </label>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-700">
            <h3 className="text-xs font-semibold text-gray-300 mb-3 uppercase tracking-wider">Optional Custom Fee</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">Fee Amount (USDC)</label>
                <input
                  type="number"
                  value={customFee}
                  onChange={(e) => setCustomFee(e.target.value)}
                  placeholder="e.g. 0.5"
                  className="w-full bg-gray-900 border border-gray-700 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">Fee Recipient</label>
                <input
                  type="text"
                  value={feeRecipient}
                  onChange={(e) => setFeeRecipient(e.target.value)}
                  placeholder="0x..."
                  className="w-full bg-gray-900 border border-gray-700 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>
          </div>

          <div className="bg-blue-900/20 border border-blue-800/50 rounded-md p-4 mt-4">
            <div className="flex items-start gap-2">
              <Info className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
              <div className="text-xs text-blue-200/80 space-y-1">
                <p><strong className="text-blue-300">CCTP v2 Fee Structure:</strong></p>
                <ul className="list-disc pl-4 space-y-0.5">
                  <li><strong>FAST:</strong> 1–14 bps protocol fee (instant liquidity).</li>
                  <li><strong>SLOW:</strong> 0% fee (standard CCTP minting time).</li>
                  <li><strong>Custom Fee:</strong> Split 90% to your recipient, 10% to Arc.</li>
                </ul>
              </div>
            </div>
          </div>

          <button
            onClick={handleExecute}
            disabled={isExecuting || !amount}
            className="w-full mt-6 flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-medium py-2.5 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isExecuting ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Processing Bridge...
              </span>
            ) : (
              "Bridge Tokens"
            )}
          </button>

          {txHash && (
            <div className="p-3 rounded-md text-sm bg-green-900/30 text-green-400 border border-green-800 mt-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                <span>Bridge Initiated Successfully!</span>
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
