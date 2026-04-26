import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import StorySyncButton from "@/components/stories/StorySyncButton";
import FlowList from "@/components/flows/FlowList";

export default async function ProjectPage({
  params,
}: {
  params: { projectId: string };
}) {
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
        <Link href="/projects" className="text-gray-500 hover:text-gray-300 text-sm mb-2 inline-block">
          ← プロジェクト一覧
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">{project.name}</h1>
            <p className="text-gray-400 text-sm mt-1">{project.storybookUrl}</p>
          </div>
          <StorySyncButton projectId={project.id} storybookUrl={project.storybookUrl} />
        </div>
      </div>

      {project.stories.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <p className="text-lg mb-2">Story がありません</p>
          <p className="text-sm">「Story を同期」ボタンで Storybook から自動取得できます</p>
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
                  {story._count.threads} コメント
                </span>
              )}
            </Link>
          ))}
        </div>
      )}

      <section className="mt-12">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">フロー</h2>
          <Link
            href={`/projects/${project.id}/flows/new`}
            className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            + 新しいフロー
          </Link>
        </div>
        <FlowList projectId={project.id} />
      </section>
    </div>
  );
}
