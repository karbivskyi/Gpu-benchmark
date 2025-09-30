import React from 'react';
import { BenchmarkResult } from '../types';

interface BenchmarkResultsProps {
  result: BenchmarkResult | null;
}

const BenchmarkResults: React.FC<BenchmarkResultsProps> = ({ result }) => {
  if (!result) {
    return (
      <div>
        <h2>Results</h2>
        <p style={{ color: '#aaa', textAlign: 'center', padding: '40px 0' }}>
          Run a benchmark to see your results
        </p>
      </div>
    );
  }

  const formatHashRate = (hashRate: number) => {
    if (hashRate >= 1000000) {
      return `${(hashRate / 1000000).toFixed(2)} MH/s`;
    } else if (hashRate >= 1000) {
      return `${(hashRate / 1000).toFixed(2)} KH/s`;
    }
    return `${hashRate.toFixed(2)} H/s`;
  };

  return (
    <div>
      <h2>Latest Results</h2>
      
      <div className="results-grid">
        <div className="result-card">
          <div className="result-value">{formatHashRate(result.hashRate)}</div>
          <div className="result-label">Hash Rate</div>
        </div>
        
        <div className="result-card">
          <div className="result-value">{result.score.toFixed(0)}</div>
          <div className="result-label">Performance Score</div>
        </div>
        
        <div className="result-card">
          <div className="result-value">{result.tokensEarned.toFixed(4)}</div>
          <div className="result-label">Tokens Earned</div>
        </div>
        
        <div className="result-card">
          <div className="result-value">{result.duration}s</div>
          <div className="result-label">Test Duration</div>
        </div>
      </div>

      <div style={{ marginTop: '20px', padding: '15px', background: 'rgba(76, 175, 80, 0.1)', borderRadius: '8px' }}>
        <p style={{ color: '#4caf50', fontWeight: '600' }}>
          ✅ Benchmark completed successfully!
        </p>
        <p style={{ fontSize: '0.9rem', color: '#aaa', marginTop: '5px' }}>
          Algorithm: {result.algorithm.toUpperCase()} | Difficulty: {result.difficulty} | 
          Timestamp: {new Date(result.timestamp).toLocaleString()}
        </p>
      </div>
    </div>
  );
};

export default BenchmarkResults;
