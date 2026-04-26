import { useState, useEffect, useCallback } from "react";
import type { ThreadData } from "@/lib/types";

export function useThreads(storyId: string, showResolved: boolean) {
  const [threads, setThreads] = useState<ThreadData[] | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchThreads = useCallback(async () => {
    const res = await fetch(
      `/api/stories/${storyId}/threads?showResolved=${showResolved}`
    );
    if (res.ok) {
      const data = await res.json();
      setThreads(data);
    }
    setLoading(false);
  }, [storyId, showResolved]);

  useEffect(() => {
    fetchThreads();
  }, [fetchThreads]);

  return { threads, loading, mutate: fetchThreads };
}
