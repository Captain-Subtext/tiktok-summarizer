export interface Summary {
  id: string;
  videoId: string;
  summaryText: string;
  userId?: string;
  anonymousId?: string;
  createdAt: string;
  expiresAt?: string;
  isCached: boolean;
} 