import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { prisma } from "@/lib/prisma";

export default async function FlowList({ projectId }: { projectId: string }) {
  const t = await getTranslations("flow");

  const flows = await prisma.flow.findMany({
    where: { projectId },
    select: {
      id: true,
      name: true,
      description: true,
      updatedAt: true,
      _count: { select: { nodes: true } },
    },
    orderBy: { updatedAt: "desc" },
  });

  if (flows.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500 border border-dashed border-gray-800 rounded-xl">
        <p className="text-sm">{t("empty")}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {flows.map((flow) => (
        <Link
          key={flow.id}
          href={`/projects/${projectId}/flows/${flow.id}`}
          className="block bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-gray-600 transition-colors"
        >
          <h3 className="font-medium mb-1 truncate">{flow.name}</h3>
          {flow.description && (
            <p className="text-gray-500 text-xs truncate mb-3">{flow.description}</p>
          )}
          <span className="text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded-full">
            {t("nodes", { count: flow._count.nodes })}
          </span>
        </Link>
      ))}
    </div>
  );
}
