"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";

export default function DeleteProjectButton({ projectId }: { projectId: string }) {
  const t = useTranslations("danger");
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    setLoading(true);
    const res = await fetch(`/api/projects/${projectId}`, { method: "DELETE" });
    if (res.ok) {
      router.push("/projects");
      router.refresh();
    } else {
      setLoading(false);
      setConfirming(false);
    }
  }

  return (
    <div className="mt-12">
      <h2 className="text-xl font-bold mb-4">{t("zone")}</h2>
      <div className="border border-red-800 rounded-lg divide-y divide-red-900/50">
        <div className="flex items-center justify-between px-5 py-4">
          <div>
            <p className="font-semibold text-sm">{t("delete_project")}</p>
            <p className="text-gray-400 text-xs mt-0.5">{t("delete_desc")}</p>
          </div>
          <div className="ml-6 shrink-0">
            {confirming ? (
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400 whitespace-nowrap">{t("confirm")}</span>
                <button
                  onClick={handleDelete}
                  disabled={loading}
                  className="text-sm bg-red-700 hover:bg-red-600 disabled:opacity-50 text-white px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap"
                >
                  {loading ? t("deleting") : t("do_delete")}
                </button>
                <button
                  onClick={() => setConfirming(false)}
                  disabled={loading}
                  className="text-sm bg-gray-800 hover:bg-gray-700 text-gray-300 px-3 py-1.5 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setConfirming(true)}
                className="text-sm text-red-400 border border-red-800 hover:bg-red-900/30 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap"
              >
                {t("delete_button")}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
