"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";

export default function NewProjectPage() {
  const t = useTranslations("projects");
  const router = useRouter();
  const [name, setName] = useState("");
  const [storybookUrl, setStorybookUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, storybookUrl }),
    });

    if (!res.ok) {
      setError(t("create_failed"));
      setLoading(false);
      return;
    }

    const project = await res.json();
    router.push(`/projects/${project.id}`);
  }

  return (
    <div className="p-8 max-w-lg mx-auto w-full">
      <h1 className="text-2xl font-bold mb-8">{t("new")}</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">{t("name")}</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="My Design System"
            required
            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">
            {t("storybook_url")}
          </label>
          <input
            type="url"
            value={storybookUrl}
            onChange={(e) => setStorybookUrl(e.target.value)}
            placeholder="http://localhost:6006"
            required
            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
          />
        </div>
        {error && <p className="text-red-400 text-sm">{error}</p>}
        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex-1 bg-gray-800 hover:bg-gray-700 text-white py-2 rounded-lg text-sm font-medium transition-colors"
          >
            {t("cancel")}
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white py-2 rounded-lg text-sm font-medium transition-colors"
          >
            {loading ? t("creating") : t("create")}
          </button>
        </div>
      </form>
    </div>
  );
}
