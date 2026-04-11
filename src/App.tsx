/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Web3Provider, useWeb3 } from './context/Web3Context';
import { WalletConnect } from './components/WalletConnect';
import { GMChain } from './components/GMChain';
import { Deployer, DeployedContract } from './components/Deployer';
import { Interaction } from './components/Interaction';
import { History } from './components/History';
import { TransactionFeed } from './components/TransactionFeed';
import { AppKitBridge } from './components/AppKitBridge';
import { AppKitSwap } from './components/AppKitSwap';
import { AppKitSend } from './components/AppKitSend';
import { Wallet, Sun, Upload, Terminal, ArrowRightLeft, RefreshCw, Send, History as HistoryIcon, Menu, X } from 'lucide-react';

type TabId = 'wallet' | 'gm' | 'deploy' | 'interact' | 'bridge' | 'swap' | 'send' | 'history';

const TABS = [
  { id: 'wallet', label: 'Wallet', icon: Wallet },
  { id: 'gm', label: 'GM Chain', icon: Sun },
  { id: 'deploy', label: 'Deploy', icon: Upload },
  { id: 'interact', label: 'Interact', icon: Terminal },
  { id: 'bridge', label: 'Bridge', icon: ArrowRightLeft },
  { id: 'swap', label: 'Swap', icon: RefreshCw },
  { id: 'send', label: 'Send', icon: Send },
  { id: 'history', label: 'History', icon: HistoryIcon },
] as const;

function AppContent() {
  const { address } = useWeb3();
  const [activeTab, setActiveTab] = useState<TabId>('wallet');
  const [activeContract, setActiveContract] = useState<DeployedContract | null>(null);
  const [history, setHistory] = useState<DeployedContract[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (address) {
      const stored = localStorage.getItem(`contracts_${address}`);
      if (stored) {
        try {
          setHistory(JSON.parse(stored));
        } catch (e) {
          console.error("Failed to parse history");
        }
      } else {
        setHistory([]);
      }
    }
  }, [address]);

  const handleDeploy = (contract: DeployedContract) => {
    setActiveContract(contract);
    setActiveTab('interact');
    if (address) {
      const newHistory = [contract, ...history];
      setHistory(newHistory);
      localStorage.setItem(`contracts_${address}`, JSON.stringify(newHistory));
    }
  };

  const handleClearHistory = () => {
    if (address && window.confirm('Are you sure you want to clear your deployed contracts history?')) {
      setHistory([]);
      localStorage.removeItem(`contracts_${address}`);
    }
  };

  const handleLoadContract = (contract: DeployedContract) => {
    setActiveContract(contract);
    setActiveTab('interact');
  };

  const renderTabContent = () => {
    if (!address && activeTab !== 'wallet') {
      return (
        <div className="flex flex-col items-center justify-center h-[60vh] text-center">
          <div className="w-20 h-20 bg-blue-900/20 rounded-full flex items-center justify-center mb-6">
            <Wallet className="w-10 h-10 text-blue-500" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">Connect Wallet First</h2>
          <p className="text-gray-400 max-w-md mb-8">
            Please connect your wallet to access the {TABS.find(t => t.id === activeTab)?.label} features.
          </p>
          <button
            onClick={() => setActiveTab('wallet')}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition-colors"
          >
            Go to Wallet Tab
          </button>
        </div>
      );
    }

    switch (activeTab) {
      case 'wallet':
        return (
          <div className="space-y-6 max-w-3xl mx-auto">
            <WalletConnect />
            {!address && (
              <div className="text-center py-12">
                <h2 className="text-2xl font-bold text-white mb-4">Welcome to Arc Testnet Studio</h2>
                <p className="text-gray-400 max-w-md mx-auto">
                  A complete developer panel for deploying smart contracts, interacting with ABIs, and generating App Kit scripts.
                </p>
              </div>
            )}
          </div>
        );
      case 'gm':
        return <div className="max-w-3xl mx-auto"><GMChain /></div>;
      case 'deploy':
        return <div className="max-w-4xl mx-auto"><Deployer onDeploy={handleDeploy} /></div>;
      case 'interact':
        return <div className="max-w-4xl mx-auto"><Interaction contract={activeContract} /></div>;
      case 'bridge':
        return <div className="max-w-5xl mx-auto"><AppKitBridge /></div>;
      case 'swap':
        return <div className="max-w-5xl mx-auto"><AppKitSwap /></div>;
      case 'send':
        return <div className="max-w-5xl mx-auto"><AppKitSend /></div>;
      case 'history':
        return (
          <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
            <History 
              contracts={history} 
              onLoad={handleLoadContract} 
              onClear={handleClearHistory}
            />
            <TransactionFeed />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#0d1117] text-gray-200 font-sans selection:bg-blue-500/30 flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-[#161b22] border-b border-gray-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
            <Wallet className="w-4 h-4 text-white" />
          </div>
          <h1 className="text-lg font-bold text-white tracking-tight">Arc Studio</h1>
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-gray-400 hover:text-white">
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`
        ${isMobileMenuOpen ? 'block' : 'hidden'} 
        md:block w-full md:w-64 bg-[#161b22] border-r border-gray-800 shrink-0 md:min-h-screen
      `}>
        <div className="hidden md:flex items-center gap-2 p-6 border-b border-gray-800">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
            <Wallet className="w-4 h-4 text-white" />
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight">Arc Studio</h1>
        </div>
        
        <nav className="p-4 space-y-1">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                  isActive 
                    ? 'bg-blue-600/10 text-blue-400' 
                    : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-blue-400' : 'text-gray-500'}`} />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto h-[calc(100vh-65px)] md:h-screen custom-scrollbar">
        {renderTabContent()}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <Web3Provider>
      <AppContent />
    </Web3Provider>
  );
}


