// src/app/page.tsx
'use client';

import { useState } from 'react';
import { ethers } from 'ethers';

export default function HomePage() {
  const [account, setAccount] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      setLoading(true);
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.send('eth_requestAccounts', []);
        setAccount(accounts[0]);
      } catch (err) {
        console.error('Utente ha rifiutato la connessione');
      } finally {
        setLoading(false);
      }
    } else {
      alert('Installa MetaMask per usare questo sito!');
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 text-center">
      <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
        attuario.network
      </h1>
      <p className="text-gray-400 mb-8 max-w-lg">
        Strumenti crypto per attuari, analisti del rischio e innovatori DeFi.
      </p>

      {account ? (
        <div className="bg-gray-900 px-6 py-3 rounded-lg border border-cyan-500/30">
          <p>Connesso: {account.slice(0, 6)}...{account.slice(-4)}</p>
        </div>
      ) : (
        <button
          onClick={connectWallet}
          disabled={loading}
          className="bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 px-8 py-3 rounded-lg font-semibold transition"
        >
          {loading ? 'Connessione...' : 'Connetti Wallet'}
        </button>
      )}

      <p className="mt-10 text-xs text-gray-500">
        Nessuna chiave privata viene mai richiesta o memorizzata.
      </p>
    </div>
  );
}