import React from 'react';
import { BenchmarkResult } from '../types';

interface LeaderboardProps {
  data: BenchmarkResult[];
}

const Leaderboard: React.FC<LeaderboardProps> = ({ data }) => {
  const sortedData = [...data]
    .sort((a, b) => b.score - a.score)
    .slice(0, 10)
    .map((result, index) => ({ ...result, rank: index + 1 }));

  const formatHashRate = (hashRate: number) => {
    if (hashRate >= 1000000) {
      return `${(hashRate / 1000000).toFixed(2)} MH/s`;
    } else if (hashRate >= 1000) {
      return `${(hashRate / 1000).toFixed(2)} KH/s`;
    }
    return `${hashRate.toFixed(2)} H/s`;
  };

  const formatAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  return (
    <div className="leaderboard">
      <h2>Global Leaderboard</h2>
      <p style={{ color: '#aaa', marginBottom: '15px' }}>
        Top 10 mining performance results from all users
      </p>

      {sortedData.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#aaa', padding: '40px 0' }}>
          No benchmark results yet. Be the first to run a test!
        </p>
      ) : (
        <table className="leaderboard-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Wallet</th>
              <th>Score</th>
              <th>Hash Rate</th>
              <th>Algorithm</th>
              <th>Tokens</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {sortedData.map((result) => (
              <tr key={result.id}>
                <td className="rank">#{result.rank}</td>
                <td className="wallet-address">{formatAddress(result.walletAddress)}</td>
                <td>{result.score.toFixed(0)}</td>
                <td>{formatHashRate(result.hashRate)}</td>
                <td>{result.algorithm.toUpperCase()}</td>
                <td>{result.tokensEarned.toFixed(4)}</td>
                <td>{new Date(result.timestamp).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Leaderboard;
