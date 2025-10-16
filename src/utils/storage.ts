import { BenchmarkResult } from '../types';

const STORAGE_KEY = 'gpu-mining-results';

export const saveResult = async (result: BenchmarkResult): Promise<void> => {
  try {
    const existingResults = getStoredResults();
    const updatedResults = [...existingResults, result];
    
    // Keep only the last 100 results to prevent storage overflow
    const limitedResults = updatedResults.slice(-100);
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(limitedResults));
  } catch (error) {
    console.error('Failed to save result:', error);
    throw new Error('Failed to save benchmark result');
  }
};

export const getLeaderboard = async (): Promise<BenchmarkResult[]> => {
  try {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const results = getStoredResults();
    
    // Add some mock data if no results exist
    if (results.length === 0) {
      return getMockLeaderboard();
    }
    
    return results;
  } catch (error) {
    console.error('Failed to load leaderboard:', error);
    return getMockLeaderboard();
  }
};

const getStoredResults = (): BenchmarkResult[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Failed to parse stored results:', error);
    return [];
  }
};

const getMockLeaderboard = (): BenchmarkResult[] => {
  return [
    {
      id: 'mock-1',
      walletAddress: 'DemoWallet1234567890abcdef',
      timestamp: Date.now() - 86400000,
      duration: 60,
      hashRate: 1250000,
      difficulty: 'hard',
      algorithm: 'sha256',
      score: 5000,
      tokensEarned: 0.4,
      gpuInfo: 'NVIDIA RTX 4090'
    },
    {
      id: 'mock-2',
      walletAddress: 'TestUser9876543210fedcba',
      timestamp: Date.now() - 172800000,
      duration: 30,
      hashRate: 890000,
      difficulty: 'medium',
      algorithm: 'scrypt',
      score: 3560,
      tokensEarned: 0.285,
      gpuInfo: 'AMD RX 7900 XTX'
    },
    {
      id: 'mock-3',
      walletAddress: 'MinerPro555666777888',
      timestamp: Date.now() - 259200000,
      duration: 120,
      hashRate: 2100000,
      difficulty: 'hard',
      algorithm: 'x11',
      score: 16800,
      tokensEarned: 1.344,
      gpuInfo: 'NVIDIA RTX 4080'
    }
  ];
};
