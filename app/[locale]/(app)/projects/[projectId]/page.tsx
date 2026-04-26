import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import StorySyncButton from "@/components/stories/StorySyncButton";
import FlowList from "@/components/flows/FlowList";
import DeleteProjectButton from "@/components/projects/DeleteProjectButton";

export default async function ProjectPage({
  params,
}: {
  params: { projectId: string; locale: string };
}) {
  setRequestLocale(params.locale);
  const t = await getTranslations();

  const session = await auth();

  const project = await prisma.project.findFirst({
    where: { id: params.projectId, ownerId: session!.user.id },
    include: {
      stories: {
        include: { _count: { select: { threads: true } } },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!project) notFound();

  return (
    <div className="p-8 max-w-4xl mx-auto w-full">
      <div className="mb-6">
        <Link
          href="/projects"
          className="text-gray-500 hover:text-gray-300 text-sm mb-2 inline-block"
        >
          {t("projects.back")}
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">{project.name}</h1>
            <p className="text-gray-400 text-sm mt-1">{project.storybookUrl}</p>
          </div>
          <StorySyncButton projectId={project.id} storybookUrl={project.storybookUrl} />
        </div>
      </div>

      <section className="mb-12">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">{t("flow.title")}</h2>
          <Link
            href={`/projects/${project.id}/flows/new`}
            className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            {t("flow.new")}
          </Link>
        </div>
        <FlowList projectId={project.id} />
      </section>

      {project.stories.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <p className="text-lg mb-2">{t("story.no_stories")}</p>
          <p className="text-sm">{t("story.no_stories_desc")}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {project.stories.map((story) => (
            <Link
              key={story.id}
              href={`/projects/${project.id}/stories/${story.id}`}
              className="block bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-gray-600 transition-colors"
            >
              <h2 className="font-medium mb-1 truncate">{story.title}</h2>
              <p className="text-gray-500 text-xs truncate mb-3">{story.storyId}</p>
              {story._count.threads > 0 && (
                <span className="text-xs bg-blue-900/50 text-blue-300 px-2 py-0.5 rounded-full">
                  {t("story.comments", { count: story._count.threads })}
                </span>
              )}
            </Link>
          ))}
        </div>
      )}

      <DeleteProjectButton projectId={project.id} />
    </div>
  );
}
