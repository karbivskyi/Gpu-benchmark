export interface TestOptions {
  duration: number; // in seconds
  difficulty: 'easy' | 'medium' | 'hard';
  algorithm: 'sha256' | 'scrypt' | 'x11';
}

export interface BenchmarkResult {
  id: string;
  walletAddress: string;
  timestamp: number;
  duration: number;
  hashRate: number; // hashes per second
  difficulty: string;
  algorithm: string;
  score: number;
  tokensEarned: number;
  gpuInfo?: string;
}

export interface LeaderboardEntry extends BenchmarkResult {
  rank: number;
}
