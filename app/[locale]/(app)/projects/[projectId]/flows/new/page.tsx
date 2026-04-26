"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter, Link } from "@/i18n/navigation";

export default function NewFlowPage({ params }: { params: { projectId: string } }) {
  const t = useTranslations("flow");
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch(`/api/projects/${params.projectId}/flows`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, description: description || null }),
    });

    if (!res.ok) {
      if (res.status === 409) {
        setError(t("duplicate_error"));
      } else {
        setError(t("create_failed"));
      }
      setLoading(false);
      return;
    }

    const flow = await res.json();
    router.push(`/projects/${params.projectId}/flows/${flow.id}`);
  }

  return (
    <div className="p-8 max-w-lg mx-auto w-full">
      <Link
        href={`/projects/${params.projectId}`}
        className="text-gray-500 hover:text-gray-300 text-sm mb-2 inline-block"
      >
        {t("back")}
      </Link>
      <h1 className="text-2xl font-bold mb-8">{t("new_page_title")}</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">
            {t("name_label")}
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t("name_placeholder")}
            required
            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">
            {t("desc_label")}
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
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
