import React, { useState, useEffect } from 'react';
import { useWeb3 } from '../context/Web3Context';
import { ethers } from 'ethers';
import { Terminal, Play, Send } from 'lucide-react';
import { DeployedContract } from './Deployer';

interface InteractionProps {
  contract: DeployedContract | null;
}

export const Interaction: React.FC<InteractionProps> = ({ contract }) => {
  const { signer, provider, addTransaction, updateTransaction, ensureArcTestnet } = useWeb3();
  const [readResults, setReadResults] = useState<Record<string, string>>({});
  const [writeInputs, setWriteInputs] = useState<Record<string, Record<string, string>>>({});
  const [loadingFunc, setLoadingFunc] = useState<string | null>(null);

  useEffect(() => {
    setReadResults({});
    setWriteInputs({});
  }, [contract]);

  if (!contract) {
    return (
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 shadow-sm flex flex-col items-center justify-center text-gray-500 h-64">
        <Terminal className="w-8 h-8 mb-2 opacity-50" />
        <p>Select or deploy a contract to interact</p>
      </div>
    );
  }

  const readFunctions = contract.abi.filter((item: any) => item.type === 'function' && (item.stateMutability === 'view' || item.stateMutability === 'pure'));
  const writeFunctions = contract.abi.filter((item: any) => item.type === 'function' && item.stateMutability !== 'view' && item.stateMutability !== 'pure');

  const handleRead = async (funcName: string, inputs: any[]) => {
    if (!provider) return;
    setLoadingFunc(funcName);
    try {
      await ensureArcTestnet();
      const ethersContract = new ethers.Contract(contract.address, contract.abi, provider);
      
      const args = inputs.map(input => writeInputs[funcName]?.[input.name] || '');
      
      const result = await ethersContract[funcName](...args);
      setReadResults(prev => ({ ...prev, [funcName]: result.toString() }));
    } catch (error: any) {
      console.error(`Read error for ${funcName}:`, error);
      setReadResults(prev => ({ ...prev, [funcName]: `Error: ${error.message}` }));
    } finally {
      setLoadingFunc(null);
    }
  };

  const handleWrite = async (funcName: string, inputs: any[]) => {
    if (!signer) return;
    setLoadingFunc(funcName);
    try {
      await ensureArcTestnet();
      const ethersContract = new ethers.Contract(contract.address, contract.abi, signer);
      
      const args = inputs.map(input => writeInputs[funcName]?.[input.name] || '');
      
      const tx = await ethersContract[funcName](...args);
      
      addTransaction({
        hash: tx.hash,
        type: `Call ${funcName}`,
        timestamp: Date.now(),
        status: 'pending'
      });

      await tx.wait();
      updateTransaction(tx.hash, 'confirmed');
      
      setReadResults(prev => ({ ...prev, [funcName]: `Tx Confirmed: ${tx.hash}` }));
    } catch (error: any) {
      console.error(`Write error for ${funcName}:`, error);
      setReadResults(prev => ({ ...prev, [funcName]: `Error: ${error.message}` }));
    } finally {
      setLoadingFunc(null);
    }
  };

  const handleInputChange = (funcName: string, inputName: string, value: string) => {
    setWriteInputs(prev => ({
      ...prev,
      [funcName]: {
        ...(prev[funcName] || {}),
        [inputName]: value
      }
    }));
  };

  const renderFunction = (func: any, isRead: boolean) => {
    const hasInputs = func.inputs && func.inputs.length > 0;

    return (
      <div key={func.name} className="bg-gray-900 rounded-md p-4 border border-gray-700">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-mono text-blue-400 font-semibold">{func.name}</h3>
          <span className={`text-xs px-2 py-0.5 rounded ${isRead ? 'bg-green-900/50 text-green-400' : 'bg-orange-900/50 text-orange-400'}`}>
            {isRead ? 'Read' : 'Write'}
          </span>
        </div>
        
        {hasInputs && (
          <div className="space-y-2 mb-3">
            {func.inputs.map((input: any, idx: number) => (
              <div key={idx}>
                <input
                  type="text"
                  placeholder={`${input.name || 'arg' + idx} (${input.type})`}
                  value={writeInputs[func.name]?.[input.name] || ''}
                  onChange={(e) => handleInputChange(func.name, input.name, e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded px-2 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center gap-3">
          <button
            onClick={() => isRead ? handleRead(func.name, func.inputs) : handleWrite(func.name, func.inputs)}
            disabled={loadingFunc === func.name}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium text-white transition-colors ${
              isRead ? 'bg-green-600 hover:bg-green-700' : 'bg-orange-600 hover:bg-orange-700'
            } disabled:opacity-50`}
          >
            {loadingFunc === func.name ? (
              <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : isRead ? (
              <Play className="w-3 h-3" />
            ) : (
              <Send className="w-3 h-3" />
            )}
            {isRead ? 'Query' : 'Execute'}
          </button>
          
          {readResults[func.name] && (
            <div className="flex-1 text-xs font-mono text-gray-300 bg-gray-800 px-2 py-1.5 rounded border border-gray-700 overflow-x-auto">
              {readResults[func.name]}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <Terminal className="w-5 h-5 text-green-500" />
        <h2 className="text-lg font-semibold text-white">Interact: {contract.name}</h2>
      </div>
      <div className="text-xs font-mono text-gray-400 mb-6 break-all">
        {contract.address}
      </div>

      <div className="space-y-6">
        {readFunctions.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-gray-300 mb-3 border-b border-gray-700 pb-1">Read Functions</h3>
            <div className="space-y-3">
              {readFunctions.map((func: any) => renderFunction(func, true))}
            </div>
          </div>
        )}

        {writeFunctions.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-gray-300 mb-3 border-b border-gray-700 pb-1">Write Functions</h3>
            <div className="space-y-3">
              {writeFunctions.map((func: any) => renderFunction(func, false))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
