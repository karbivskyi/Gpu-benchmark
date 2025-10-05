import React, { useState } from 'react';
import { apiClient } from '../services/api';
import { setCurrentUser, clearCurrentUser, getCurrentUser } from '../utils/storage';

interface WalletConnectionProps {
  onWalletConnect: (address: string) => void;
  walletAddress: string;
}

const WalletConnection: React.FC<WalletConnectionProps> = ({
  onWalletConnect,
  walletAddress
}) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [balance, setBalance] = useState<number | null>(null);

  const connectWallet = async () => {
    setIsConnecting(true);
    try {
      // Simulate wallet connection - in real app, use @solana/wallet-adapter
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Generate a mock wallet address for demo
      const mockAddress = `${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
      
      // Authenticate with backend
      const authResponse = await apiClient.authenticate(mockAddress);
      setCurrentUser(authResponse.user);
      
      // Get wallet balance
      const balanceResponse = await apiClient.getWalletBalance(authResponse.user.id);
      setBalance(parseFloat(balanceResponse.virtualBalance));
      
      onWalletConnect(mockAddress);
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    clearCurrentUser();
    setBalance(null);
    onWalletConnect('');
  };

  return (
    <div className="wallet-section">
      <h2>Wallet Connection</h2>
      
      {!walletAddress ? (
        <button 
          className="wallet-button"
          onClick={connectWallet}
          disabled={isConnecting}
        >
          {isConnecting ? (
            <>
              <span className="loading"></span>
              Connecting...
            </>
          ) : (
            'Connect Wallet'
          )}
        </button>
      ) : (
        <>
          <div className="wallet-info">
            <p><strong>Connected Wallet:</strong></p>
            <p className="wallet-address">{walletAddress}</p>
            {balance !== null && (
              <div className="balance-info">
                <p><strong>BMT Balance:</strong> {balance.toFixed(2)} BMT</p>
              </div>
            )}
          </div>
          <button 
            className="wallet-button"
            onClick={disconnectWallet}
            style={{ background: '#666', marginTop: '10px' }}
          >
            Disconnect
          </button>
        </>
      )}
      
      <p style={{ fontSize: '0.9rem', color: '#aaa', marginTop: '10px' }}>
        Connect your wallet to receive mining rewards (80% of tokens earned)
      </p>
    </div>
  );
};

export default WalletConnection;
