import React from 'react';
import { useWeb3 } from '../context/Web3Context';
import { Activity, ExternalLink, CheckCircle, Clock, XCircle } from 'lucide-react';

export const TransactionFeed: React.FC = () => {
  const { transactions } = useWeb3();

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <Activity className="w-5 h-5 text-teal-500" />
        <h2 className="text-lg font-semibold text-white">Recent Transactions</h2>
      </div>

      {transactions.length === 0 ? (
        <div className="text-sm text-gray-500 text-center py-6">
          No transactions in this session.
        </div>
      ) : (
        <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
          {transactions.map((tx, idx) => (
            <div key={idx} className="bg-gray-900 rounded-md p-3 border border-gray-700 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {tx.status === 'pending' && <Clock className="w-4 h-4 text-yellow-500 animate-pulse" />}
                {tx.status === 'confirmed' && <CheckCircle className="w-4 h-4 text-green-500" />}
                {tx.status === 'failed' && <XCircle className="w-4 h-4 text-red-500" />}
                
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-white">{tx.type}</span>
                  <span className="text-xs text-gray-500">{new Date(tx.timestamp).toLocaleTimeString()}</span>
                </div>
              </div>

              <a
                href={`https://testnet.arcscan.app/tx/${tx.hash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs font-mono text-blue-400 hover:text-blue-300 bg-blue-900/20 px-2 py-1 rounded"
              >
                {tx.hash.substring(0, 6)}...{tx.hash.substring(tx.hash.length - 4)}
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
