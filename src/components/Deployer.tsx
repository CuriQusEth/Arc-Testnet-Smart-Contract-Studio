import React, { useState } from 'react';
import { useWeb3 } from '../context/Web3Context';
import { ethers } from 'ethers';
import { Code, Upload, CheckCircle, ExternalLink } from 'lucide-react';
import contractsData from '../contracts.json';

export interface DeployedContract {
  address: string;
  name: string;
  timestamp: number;
  abi: any;
}

interface DeployerProps {
  onDeploy: (contract: DeployedContract) => void;
}

export const Deployer: React.FC<DeployerProps> = ({ onDeploy }) => {
  const { signer, address, addTransaction, updateTransaction, ensureArcTestnet } = useWeb3();
  const [abiInput, setAbiInput] = useState('');
  const [bytecodeInput, setBytecodeInput] = useState('');
  const [contractName, setContractName] = useState('MyContract');
  const [constructorArgs, setConstructorArgs] = useState<string>('');
  const [isDeploying, setIsDeploying] = useState(false);
  const [deployStatus, setDeployStatus] = useState<string>('');
  const [deployedAddress, setDeployedAddress] = useState<string | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const loadPreset = (name: keyof typeof contractsData) => {
    const preset = contractsData[name];
    setAbiInput(JSON.stringify(preset.abi, null, 2));
    setBytecodeInput(preset.bytecode);
    setContractName(name);
    setConstructorArgs('');
  };

  const handleDeploy = async () => {
    if (!signer || !address) return;
    
    setIsDeploying(true);
    setDeployStatus('Deploying...');
    setDeployedAddress(null);

    try {
      await ensureArcTestnet();
      const abi = JSON.parse(abiInput);
      const factory = new ethers.ContractFactory(abi, bytecodeInput, signer);
      
      const args = constructorArgs ? constructorArgs.split(',').map(s => s.trim()) : [];
      
      const contract = await factory.deploy(...args);
      
      const txHash = contract.deploymentTransaction()?.hash;
      if (txHash) {
        addTransaction({
          hash: txHash,
          type: 'Deploy',
          timestamp: Date.now(),
          status: 'pending'
        });
      }

      setDeployStatus('Confirming...');
      await contract.waitForDeployment();
      
      const deployedAddr = await contract.getAddress();
      setDeployedAddress(deployedAddr);
      setDeployStatus('Deployed ✓');
      
      if (txHash) {
        updateTransaction(txHash, 'confirmed');
      }

      const newContract: DeployedContract = {
        address: deployedAddr,
        name: contractName,
        timestamp: Date.now(),
        abi: abi
      };
      
      onDeploy(newContract);

    } catch (error: any) {
      console.error("Deployment failed:", error);
      setDeployStatus(`Failed: ${error.message || 'Unknown error'}`);
    } finally {
      setIsDeploying(false);
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Upload className="w-5 h-5 text-blue-500" />
          <h2 className="text-lg font-semibold text-white">Smart Contract Deployer</h2>
        </div>
        <div className="flex gap-2">
          <button onClick={() => loadPreset('SimpleStorage')} className="text-xs bg-gray-700 hover:bg-gray-600 text-gray-200 px-2 py-1 rounded">Simple Storage</button>
          <button onClick={() => loadPreset('MinimalERC20')} className="text-xs bg-gray-700 hover:bg-gray-600 text-gray-200 px-2 py-1 rounded">ERC-20</button>
          <button onClick={() => loadPreset('GMRegistry')} className="text-xs bg-gray-700 hover:bg-gray-600 text-gray-200 px-2 py-1 rounded">GM Registry</button>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1">Contract Name</label>
          <input
            type="text"
            value={contractName}
            onChange={(e) => setContractName(e.target.value)}
            className="w-full bg-gray-900 border border-gray-700 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <button 
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"
          >
            {showAdvanced ? 'Hide Advanced Details' : 'Show Advanced Details (ABI & Bytecode)'}
          </button>
        </div>

        {showAdvanced && (
          <div className="space-y-4 p-4 bg-gray-900/50 rounded-md border border-gray-700/50">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">ABI (JSON)</label>
              <textarea
                value={abiInput}
                onChange={(e) => setAbiInput(e.target.value)}
                rows={4}
                className="w-full bg-gray-900 border border-gray-700 rounded-md px-3 py-2 text-xs font-mono text-gray-300 focus:outline-none focus:border-blue-500"
                placeholder="[{...}]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">Bytecode (Hex)</label>
              <textarea
                value={bytecodeInput}
                onChange={(e) => setBytecodeInput(e.target.value)}
                rows={3}
                className="w-full bg-gray-900 border border-gray-700 rounded-md px-3 py-2 text-xs font-mono text-gray-300 focus:outline-none focus:border-blue-500"
                placeholder="0x..."
              />
            </div>
          </div>
        )}

        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1">Constructor Arguments (comma separated)</label>
          <input
            type="text"
            value={constructorArgs}
            onChange={(e) => setConstructorArgs(e.target.value)}
            className="w-full bg-gray-900 border border-gray-700 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
            placeholder="arg1, arg2..."
          />
        </div>

        <button
          onClick={handleDeploy}
          disabled={isDeploying || !address || !abiInput || !bytecodeInput}
          className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isDeploying ? (
            <span className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              {deployStatus}
            </span>
          ) : (
            "Deploy Contract"
          )}
        </button>

        {deployStatus && !isDeploying && (
          <div className={`p-3 rounded-md text-sm ${deployedAddress ? 'bg-green-900/30 text-green-400 border border-green-800' : 'bg-red-900/30 text-red-400 border border-red-800'}`}>
            <div className="flex items-center gap-2">
              {deployedAddress ? <CheckCircle className="w-4 h-4" /> : null}
              <span>{deployStatus}</span>
            </div>
            {deployedAddress && (
              <div className="mt-2 text-xs font-mono break-all">
                Address: {deployedAddress}
                <a 
                  href={`https://testnet.arcscan.app/address/${deployedAddress}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-2 inline-flex items-center gap-1 text-blue-400 hover:text-blue-300"
                >
                  View <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
