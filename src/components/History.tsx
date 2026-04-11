import React from 'react';
import { History as HistoryIcon, Trash2, Copy, ExternalLink } from 'lucide-react';
import { DeployedContract } from './Deployer';

interface HistoryProps {
  contracts: DeployedContract[];
  onLoad: (contract: DeployedContract) => void;
  onClear: () => void;
}

export const History: React.FC<HistoryProps> = ({ contracts, onLoad, onClear }) => {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <HistoryIcon className="w-5 h-5 text-purple-500" />
          <h2 className="text-lg font-semibold text-white">Deployed Contracts</h2>
        </div>
        {contracts.length > 0 && (
          <button
            onClick={onClear}
            className="text-xs flex items-center gap-1 text-red-400 hover:text-red-300 transition-colors"
          >
            <Trash2 className="w-3 h-3" /> Clear
          </button>
        )}
      </div>

      {contracts.length === 0 ? (
        <div className="text-sm text-gray-500 text-center py-6">
          No contracts deployed yet.
        </div>
      ) : (
        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
          {contracts.map((contract, idx) => (
            <div key={idx} className="bg-gray-900 rounded-md p-3 border border-gray-700 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="font-medium text-sm text-white">{contract.name}</span>
                <span className="text-xs text-gray-500">
                  {new Date(contract.timestamp).toLocaleString()}
                </span>
              </div>
              
              <div className="flex items-center justify-between bg-gray-800 rounded px-2 py-1">
                <span className="text-xs font-mono text-gray-400 truncate mr-2">
                  {contract.address}
                </span>
                <div className="flex items-center gap-2 shrink-0">
                  <button onClick={() => copyToClipboard(contract.address)} className="text-gray-400 hover:text-white">
                    <Copy className="w-3 h-3" />
                  </button>
                  <a href={`https://testnet.arcscan.app/address/${contract.address}`} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-400">
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              <button
                onClick={() => onLoad(contract)}
                className="w-full mt-1 py-1.5 bg-gray-700 hover:bg-gray-600 text-white text-xs rounded transition-colors"
              >
                Load ABI for Interaction
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
