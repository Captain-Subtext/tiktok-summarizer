import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { claimAnonymousSummaries } from "../services/claimService";
import { Summary } from "../types/Summary";

export const UnclaimedSummaries = () => {
  const { user } = useAuth();
  const [summaries, setSummaries] = useState<Summary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const claimSummaries = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        if (!token) {
          setLoading(false);
          return;
        }

        const claimed = await claimAnonymousSummaries(token);
        setSummaries(claimed);
      } catch (err) {
        setError('Failed to claim summaries');
        console.error('Error claiming summaries:', err);
      } finally {
        setLoading(false);
      }
    };

    claimSummaries();
  }, [user]);

  if (!user) return null;

  if (loading) {
    return (
      <div className="flex justify-center items-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <span className="ml-2">Loading unclaimed summaries...</span>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (!summaries.length) {
    return null;
  }

  return (
    <div className="unclaimed-summaries">
      <h3 className="text-lg font-semibold mb-4">Recently Claimed Summaries</h3>
      <div className="space-y-4">
        {summaries.map(summary => (
          <div key={summary.id} className="p-4 bg-white rounded shadow">
            <p className="text-sm text-gray-600">Video ID: {summary.videoId}</p>
            <p className="mt-2">{summary.summaryText}</p>
            <p className="text-xs text-gray-500 mt-2">
              Created: {new Date(summary.createdAt).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}; 