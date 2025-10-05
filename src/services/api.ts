// API configuration
const API_BASE_URL = 'http://localhost:3001/api';

// API client class
class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.token = localStorage.getItem('auth_token');
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  // Auth methods
  async authenticate(walletAddress: string, username?: string) {
    const data = await this.request('/users/auth', {
      method: 'POST',
      body: JSON.stringify({ walletAddress, username }),
    });

    this.token = data.token;
    localStorage.setItem('auth_token', data.token);
    return data;
  }

  async getProfile(walletAddress: string) {
    return this.request(`/users/profile/${walletAddress}`);
  }

  // Benchmark methods
  async submitBenchmark(benchmarkData: BenchmarkSubmission) {
    return this.request('/benchmark/submit', {
      method: 'POST',
      body: JSON.stringify(benchmarkData),
    });
  }

  async getBenchmarkLeaderboard(filters: BenchmarkFilters = {}) {
    const params = new URLSearchParams();
    if (filters.algorithm) params.append('algorithm', filters.algorithm);
    if (filters.difficulty) params.append('difficulty', filters.difficulty);
    if (filters.period) params.append('period', filters.period);

    const queryString = params.toString();
    const endpoint = `/benchmark/leaderboard${queryString ? `?${queryString}` : ''}`;
    
    return this.request(endpoint);
  }

  async getBenchmarkHistory(userId: string, page = 1, limit = 20) {
    return this.request(`/benchmark/history/${userId}?page=${page}&limit=${limit}`);
  }

  async getBenchmarkStats() {
    return this.request('/benchmark/stats');
  }

  // Wallet methods
  async getWalletBalance(userId: string) {
    return this.request(`/wallet/balance/${userId}`);
  }

  async requestWithdrawal(userId: string, amount: number, toAddress: string) {
    return this.request('/wallet/withdraw', {
      method: 'POST',
      body: JSON.stringify({ userId, amount, toAddress }),
    });
  }

  async getTransactionHistory(userId: string, page = 1, limit = 20, type?: string) {
    let endpoint = `/wallet/transactions/${userId}?page=${page}&limit=${limit}`;
    if (type) endpoint += `&type=${type}`;
    
    return this.request(endpoint);
  }

  async getWithdrawalStatus(transactionId: string) {
    return this.request(`/wallet/withdrawal/${transactionId}`);
  }
}

// WebSocket client class
class WebSocketClient {
  private ws: WebSocket | null = null;
  private url: string;
  private reconnectInterval: number = 5000;
  private messageHandlers: Map<string, (payload: any) => void> = new Map();

  constructor(url: string) {
    this.url = url;
  }

  connect() {
    try {
      this.ws = new WebSocket(this.url);

      this.ws.onopen = () => {
        console.log('WebSocket connected');
      };

      this.ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          const handler = this.messageHandlers.get(message.type);
          if (handler) {
            handler(message.payload);
          }
        } catch (error) {
          console.error('WebSocket message parse error:', error);
        }
      };

      this.ws.onclose = () => {
        console.log('WebSocket disconnected');
        setTimeout(() => this.connect(), this.reconnectInterval);
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
    } catch (error) {
      console.error('WebSocket connection error:', error);
    }
  }

  send(type: string, payload: any) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type, payload }));
    }
  }

  on(messageType: string, handler: (payload: any) => void) {
    this.messageHandlers.set(messageType, handler);
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}

// Types
export interface BenchmarkSubmission {
  userId: string;
  duration: number;
  hashRate: number;
  difficulty: string;
  algorithm: string;
  score: number;
  gpuInfo?: string;
}

export interface BenchmarkFilters {
  algorithm?: string;
  difficulty?: string;
  period?: string;
}

export interface User {
  id: string;
  walletAddress: string;
  username: string;
  virtualBalance: number;
  totalMined: number;
}

// Create singleton instances
export const apiClient = new ApiClient(API_BASE_URL);
export const wsClient = new WebSocketClient('ws://localhost:3001');