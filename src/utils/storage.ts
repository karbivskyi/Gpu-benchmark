import { BenchmarkResult } from '../types';
import { apiClient, BenchmarkSubmission, User } from '../services/api';

const STORAGE_KEY = 'gpu-mining-results';
const USER_KEY = 'current-user';

export const saveResult = async (result: BenchmarkResult): Promise<void> => {
  try {
    // Get current user from localStorage
    const currentUser = getCurrentUser();
    if (!currentUser) {
      throw new Error('User not authenticated');
    }

    // Submit to backend API
    const submission: BenchmarkSubmission = {
      userId: currentUser.id,
      duration: result.duration,
      hashRate: result.hashRate,
      difficulty: result.difficulty,
      algorithm: result.algorithm,
      score: result.score,
      gpuInfo: result.gpuInfo
    };

    const response = await apiClient.submitBenchmark(submission);
    
    // Also save locally as backup
    const existingResults = getStoredResults();
    const updatedResults = [...existingResults, result];
    const limitedResults = updatedResults.slice(-100);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(limitedResults));

    console.log('Benchmark result saved:', response);
  } catch (error) {
    console.error('Failed to save result:', error);
    
    // Fallback to local storage only
    const existingResults = getStoredResults();
    const updatedResults = [...existingResults, result];
    const limitedResults = updatedResults.slice(-100);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(limitedResults));
    
    throw new Error('Failed to save benchmark result to server, saved locally');
  }
};

export const getLeaderboard = async (): Promise<BenchmarkResult[]> => {
  try {
    // Try to fetch from API first
    const response = await apiClient.getBenchmarkLeaderboard();
    return response.leaderboard.map((entry: any) => ({
      id: entry.id,
      walletAddress: entry.walletAddress,
      timestamp: new Date(entry.timestamp).getTime(),
      duration: parseInt(entry.duration) || 0,
      hashRate: parseFloat(entry.hashRate) || 0,
      difficulty: entry.difficulty || 'medium',
      algorithm: entry.algorithm || 'sha256',
      score: parseFloat(entry.score) || 0,
      tokensEarned: parseFloat(entry.tokensEarned) || 0,
      gpuInfo: entry.gpuInfo || 'Unknown GPU'
    }));
  } catch (error) {
    console.error('Failed to load leaderboard from API:', error);
    
    // Fallback to local storage
    const results = getStoredResults();
    if (results.length === 0) {
      return getMockLeaderboard();
    }
    return results;
  }
};

// User management functions
export const getCurrentUser = (): User | null => {
  try {
    const stored = localStorage.getItem(USER_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error('Failed to get current user:', error);
    return null;
  }
};

export const setCurrentUser = (user: User): void => {
  try {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  } catch (error) {
    console.error('Failed to set current user:', error);
  }
};

export const clearCurrentUser = (): void => {
  try {
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem('auth_token');
  } catch (error) {
    console.error('Failed to clear current user:', error);
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
