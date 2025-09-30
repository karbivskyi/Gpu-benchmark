import React, { useState } from 'react';
import { TestOptions } from '../types';

interface BenchmarkControlsProps {
  onStartBenchmark: (options: TestOptions) => void;
  isRunning: boolean;
  progress: number;
  walletConnected: boolean;
}

const BenchmarkControls: React.FC<BenchmarkControlsProps> = ({
  onStartBenchmark,
  isRunning,
  progress,
  walletConnected
}) => {
  const [options, setOptions] = useState<TestOptions>({
    duration: 30,
    difficulty: 'medium',
    algorithm: 'sha256'
  });

  const handleStart = () => {
    onStartBenchmark(options);
  };

  return (
    <div>
      <h2>Benchmark Settings</h2>
      
      <div className="test-options">
        <div className="option-group">
          <label>Test Duration</label>
          <select
            value={options.duration}
            onChange={(e) => setOptions({...options, duration: Number(e.target.value)})}
            disabled={isRunning}
          >
            <option value={15}>15 seconds</option>
            <option value={30}>30 seconds</option>
            <option value={60}>1 minute</option>
            <option value={120}>2 minutes</option>
            <option value={300}>5 minutes</option>
          </select>
        </div>

        <div className="option-group">
          <label>Difficulty</label>
          <select
            value={options.difficulty}
            onChange={(e) => setOptions({...options, difficulty: e.target.value as any})}
            disabled={isRunning}
          >
            <option value="easy">Easy (Lower rewards)</option>
            <option value="medium">Medium (Balanced)</option>
            <option value="hard">Hard (Higher rewards)</option>
          </select>
        </div>

        <div className="option-group">
          <label>Mining Algorithm</label>
          <select
            value={options.algorithm}
            onChange={(e) => setOptions({...options, algorithm: e.target.value as any})}
            disabled={isRunning}
          >
            <option value="sha256">SHA-256 (Bitcoin-style)</option>
            <option value="scrypt">Scrypt (Litecoin-style)</option>
            <option value="x11">X11 (Dash-style)</option>
          </select>
        </div>
      </div>

      <button
        className="start-button"
        onClick={handleStart}
        disabled={isRunning || !walletConnected}
      >
        {isRunning ? 'Running Benchmark...' : 'Start Mining Benchmark'}
      </button>

      {isRunning && (
        <div className="benchmark-status">
          <p>Mining in progress... {Math.round(progress)}%</p>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p style={{ fontSize: '0.9rem', color: '#aaa' }}>
            Testing {options.algorithm.toUpperCase()} algorithm at {options.difficulty} difficulty
          </p>
        </div>
      )}

      {!walletConnected && (
        <p style={{ fontSize: '0.9rem', color: '#ff6b6b', marginTop: '10px' }}>
          Please connect your wallet to start benchmarking
        </p>
      )}
    </div>
  );
};

export default BenchmarkControls;
