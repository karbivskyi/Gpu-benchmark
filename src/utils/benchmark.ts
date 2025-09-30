import { TestOptions, BenchmarkResult } from '../types';

// Simulated mining algorithms
const algorithms = {
  sha256: (data: string) => {
    // Simplified SHA-256 simulation
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
      const char = data.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(16);
  },
  
  scrypt: (data: string) => {
    // Simplified Scrypt simulation (more memory intensive)
    let hash = 0;
    const memory = new Array(1000).fill(0);
    
    for (let i = 0; i < data.length; i++) {
      const char = data.charCodeAt(i);
      hash = ((hash << 3) - hash) + char;
      memory[i % 1000] = hash;
      hash = hash & hash;
    }
    
    // Additional memory operations
    for (let i = 0; i < 100; i++) {
      hash ^= memory[i % 1000];
    }
    
    return Math.abs(hash).toString(16);
  },
  
  x11: (data: string) => {
    // Simplified X11 simulation (multiple hash rounds)
    let hash = 0;
    
    // Simulate 11 different hash functions
    for (let round = 0; round < 11; round++) {
      for (let i = 0; i < data.length; i++) {
        const char = data.charCodeAt(i);
        hash = ((hash << (round + 1)) - hash) + char + round;
        hash = hash & hash;
      }
    }
    
    return Math.abs(hash).toString(16);
  }
};

const difficultyMultipliers = {
  easy: 1,
  medium: 2,
  hard: 4
};

export const runBenchmark = async (
  options: TestOptions,
  walletAddress: string,
  onProgress: (progress: number) => void
): Promise<BenchmarkResult> => {
  const startTime = Date.now();
  const endTime = startTime + (options.duration * 1000);
  let hashCount = 0;
  let nonce = 0;
  
  const algorithm = algorithms[options.algorithm];
  const difficultyTarget = difficultyMultipliers[options.difficulty];
  
  return new Promise((resolve) => {
    const miningLoop = () => {
      const currentTime = Date.now();
      const elapsed = currentTime - startTime;
      const progress = Math.min((elapsed / (options.duration * 1000)) * 100, 100);
      
      onProgress(progress);
      
      if (currentTime >= endTime) {
        // Calculate final results
        const actualDuration = elapsed / 1000;
        const hashRate = hashCount / actualDuration;
        const baseScore = hashRate * difficultyTarget;
        const score = baseScore * (options.duration / 30); // Normalize to 30-second baseline
        
        // Calculate token rewards (simplified)
        const baseTokens = score / 10000; // Base rate
        const tokensEarned = baseTokens * 0.8; // 80% to user, 20% to app
        
        const result: BenchmarkResult = {
          id: `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`,
          walletAddress,
          timestamp: Date.now(),
          duration: options.duration,
          hashRate,
          difficulty: options.difficulty,
          algorithm: options.algorithm,
          score,
          tokensEarned,
          gpuInfo: navigator.userAgent // Simplified GPU info
        };
        
        resolve(result);
        return;
      }
      
      // Perform mining work
      const batchSize = 1000;
      for (let i = 0; i < batchSize; i++) {
        const data = `${walletAddress}-${nonce}-${currentTime}`;
        const hash = algorithm(data);
        
        // Check if hash meets difficulty (simplified)
        const hashValue = parseInt(hash.substring(0, 8), 16);
        if (hashValue % (difficultyTarget * 1000) === 0) {
          // Found a valid hash (rare event)
          hashCount += batchSize * 2; // Bonus for finding valid hash
        } else {
          hashCount++;
        }
        
        nonce++;
      }
      
      // Continue mining
      setTimeout(miningLoop, 10);
    };
    
    miningLoop();
  });
};
