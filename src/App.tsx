import React, { useState, useEffect } from 'react';
import WalletConnection from './components/WalletConnection';
import BenchmarkControls from './components/BenchmarkControls';
import BenchmarkResults from './components/BenchmarkResults';
import Leaderboard from './components/Leaderboard';
import { BenchmarkResult, TestOptions } from './types';
import { runBenchmark } from './utils/benchmark';
import { saveResult, getLeaderboard } from './utils/storage';

const App: React.FC = () => {
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [isRunning, setBenchmarkRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentResult, setCurrentResult] = useState<BenchmarkResult | null>(null);
  const [leaderboardData, setLeaderboardData] = useState<BenchmarkResult[]>([]);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    loadLeaderboard();
  }, []);

  const loadLeaderboard = async () => {
    try {
      const data = await getLeaderboard();
      setLeaderboardData(data);
    } catch (err) {
      console.error('Failed to load leaderboard:', err);
    }
  };

  const handleStartBenchmark = async (options: TestOptions) => {
    if (!walletAddress) {
      setError('Please connect your wallet first');
      return;
    }

    setError('');
    setBenchmarkRunning(true);
    setProgress(0);
    setCurrentResult(null);

    try {
      const result = await runBenchmark(options, walletAddress, (progress) => {
        setProgress(progress);
      });

      setCurrentResult(result);
      await saveResult(result);
      await loadLeaderboard();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Benchmark failed');
    } finally {
      setBenchmarkRunning(false);
      setProgress(0);
    }
  };

  return (
    <div className="container">
      <header className="header">
        <h1>GPU Mining Benchmark</h1>
        <p>Test your GPU performance and earn rewards based on your contribution</p>
      </header>

      {error && (
        <div className="error">
          {error}
        </div>
      )}

      <div className="main-content">
        <div className="card">
          <WalletConnection 
            onWalletConnect={setWalletAddress}
            walletAddress={walletAddress}
          />
          
          <BenchmarkControls
            onStartBenchmark={handleStartBenchmark}
            isRunning={isRunning}
            progress={progress}
            walletConnected={!!walletAddress}
          />
        </div>

        <div className="card">
          <BenchmarkResults result={currentResult} />
        </div>
      </div>

      <div className="card results-section">
        <Leaderboard data={leaderboardData} />
      </div>
    </div>
  );
};

export default App;
