import React, { useState, useEffect } from 'react';
import { useWeb3 } from '../context/Web3Context';
import { ethers } from 'ethers';
import { Sun, Clock, ExternalLink } from 'lucide-react';

export const GMChain: React.FC = () => {
  const { signer, address, addTransaction, updateTransaction, ensureArcTestnet } = useWeb3();
  const [message, setMessage] = useState('gm from Arc Testnet 🌞');
  const [isSending, setIsSending] = useState(false);
  const [lastGMTime, setLastGMTime] = useState<number>(0);
  const [gmCount, setGmCount] = useState<number>(0);
  const [lastTxHash, setLastTxHash] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState<string>('');

  useEffect(() => {
    if (address) {
      const storedTime = localStorage.getItem(`lastGM_${address}`);
      const storedCount = localStorage.getItem(`gmCount_${address}`);
      if (storedTime) setLastGMTime(parseInt(storedTime, 10));
      if (storedCount) setGmCount(parseInt(storedCount, 10));
    }
  }, [address]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (lastGMTime > 0) {
        const now = Date.now();
        const diff = now - lastGMTime;
        const cooldown = 24 * 60 * 60 * 1000;
        if (diff < cooldown) {
          const remaining = cooldown - diff;
          const hours = Math.floor(remaining / (1000 * 60 * 60));
          const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
          setTimeLeft(`${hours}h ${minutes}m`);
        } else {
          setTimeLeft('');
        }
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [lastGMTime]);

  const handleSendGM = async () => {
    if (!signer || !address) return;
    
    setIsSending(true);
    try {
      await ensureArcTestnet();
      const hexData = ethers.hexlify(ethers.toUtf8Bytes(message));
      
      const tx = await signer.sendTransaction({
        to: address,
        value: 0,
        data: hexData
      });

      setLastTxHash(tx.hash);
      addTransaction({
        hash: tx.hash,
        type: 'GM',
        timestamp: Date.now(),
        status: 'pending'
      });

      await tx.wait();
      
      updateTransaction(tx.hash, 'confirmed');
      
      const now = Date.now();
      setLastGMTime(now);
      const newCount = gmCount + 1;
      setGmCount(newCount);
      
      localStorage.setItem(`lastGM_${address}`, now.toString());
      localStorage.setItem(`gmCount_${address}`, newCount.toString());
      
    } catch (error) {
      console.error("Failed to send GM:", error);
      // Could add toast here
    } finally {
      setIsSending(false);
    }
  };

  const isOnCooldown = timeLeft !== '';

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <Sun className="w-5 h-5 text-yellow-500" />
        <h2 className="text-lg font-semibold text-white">GM Chain</h2>
      </div>
      
      <p className="text-sm text-gray-400 mb-4">
        Send a daily on-chain greeting. This sends a 0 ETH transaction to yourself with the message encoded in the data field.
      </p>

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1">Message (Max 280 chars)</label>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value.slice(0, 280))}
            disabled={isOnCooldown || isSending || !address}
            className="w-full bg-gray-900 border border-gray-700 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 disabled:opacity-50"
          />
        </div>

        <button
          onClick={handleSendGM}
          disabled={isOnCooldown || isSending || !address || !message.trim()}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-white font-medium py-2.5 rounded-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSending ? (
            <span className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Sending...
            </span>
          ) : isOnCooldown ? (
            <span className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Cooldown: {timeLeft}
            </span>
          ) : (
            "Send GM"
          )}
        </button>

        <div className="flex justify-between items-center text-xs text-gray-400 pt-2 border-t border-gray-700">
          <span>Total GMs Sent: <strong className="text-white">{gmCount}</strong></span>
          {lastTxHash && (
            <a 
              href={`https://testnet.arcscan.app/tx/${lastTxHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-blue-400 hover:text-blue-300"
            >
              View Last GM <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};
