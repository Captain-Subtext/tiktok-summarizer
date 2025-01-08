import { Summary } from '../types/Summary';

export const claimAnonymousSummaries = async (token: string): Promise<Summary[]> => {
  try {
    const response = await fetch('/api/summaries/claim', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to claim summaries');
    }

    return response.json();
  } catch (error) {
    console.error('Error claiming summaries:', error);
    throw error;
  }
}; 