"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

interface StorySyncButtonProps {
  projectId: string;
  storybookUrl: string;
}

export default function StorySyncButton({ projectId, storybookUrl }: StorySyncButtonProps) {
  const t = useTranslations("sync");
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSync() {
    setLoading(true);
    setError("");

    // Storybook v7+ の index.json、v6 の stories.json をフェッチ
    const endpoints = [
      `${storybookUrl.replace(/\/$/, "")}/index.json`,
      `${storybookUrl.replace(/\/$/, "")}/stories.json`,
    ];

    let storiesData: Record<string, { id: string; name: string; title: string }> | null = null;

    for (const endpoint of endpoints) {
      try {
        const res = await fetch(`/api/proxy-storybook?url=${encodeURIComponent(endpoint)}`);
        if (res.ok) {
          const json = await res.json();
          storiesData = json.entries ?? json.stories ?? null;
          if (storiesData) break;
        }
      } catch {}
    }

    if (!storiesData) {
      setError(t("error"));
      setLoading(false);
      return;
    }

    const baseUrl = storybookUrl.replace(/\/$/, "");
    const stories = Object.values(storiesData).filter((s) => s.id && s.name);

    for (const story of stories) {
      await fetch(`/api/projects/${projectId}/stories`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          storyId: story.id,
          title: `${story.title} / ${story.name}`,
          url: `${baseUrl}/iframe.html?id=${story.id}`,
        }),
      });
    }

    router.refresh();
    setLoading(false);
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        onClick={handleSync}
        disabled={loading}
        className="bg-gray-800 hover:bg-gray-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
      >
        {loading ? t("syncing") : t("button")}
      </button>
      {error && <p className="text-red-400 text-xs">{error}</p>}
    </div>
  );
}
