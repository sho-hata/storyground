import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export default async function ProjectsPage({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale);
  const t = await getTranslations("projects");

  const session = await auth();
  const projects = await prisma.project.findMany({
    where: { ownerId: session!.user.id },
    include: { _count: { select: { stories: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-8 max-w-4xl mx-auto w-full">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">{t("title")}</h1>
        <Link
          href="/projects/new"
          className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          + {t("new")}
        </Link>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <p className="text-lg mb-2">{t("empty_title")}</p>
          <p className="text-sm">{t("empty_desc")}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {projects.map((project) => (
            <Link
              key={project.id}
              href={`/projects/${project.id}`}
              className="block bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-gray-600 transition-colors"
            >
              <h2 className="font-semibold text-lg mb-1">{project.name}</h2>
              <p className="text-gray-400 text-sm truncate mb-3">{project.storybookUrl}</p>
              <p className="text-gray-500 text-xs">
                {t("stories", { count: project._count.stories })}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
