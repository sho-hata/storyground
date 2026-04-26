import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import StoryViewerPage from "@/components/viewer/StoryViewerPage";

export default async function StoryPage({
  params,
}: {
  params: { projectId: string; storyId: string };
}) {
  const session = await auth();

  const story = await prisma.story.findFirst({
    where: {
      id: params.storyId,
      project: { id: params.projectId, ownerId: session!.user.id },
    },
    include: { project: true },
  });

  if (!story) notFound();

  return (
    <div className="flex flex-col h-[calc(100vh-53px)]">
      <div className="border-b border-gray-800 bg-gray-900 px-4 py-2 flex items-center gap-3 shrink-0">
        <Link
          href={`/projects/${params.projectId}`}
          className="text-gray-500 hover:text-gray-300 text-sm"
        >
          ← {story.project.name}
        </Link>
        <span className="text-gray-700">/</span>
        <span className="text-sm text-gray-300">{story.title}</span>
      </div>
      <StoryViewerPage
        storyId={story.id}
        storyUrl={story.url}
        currentUserId={session!.user.id}
      />
    </div>
  );
}
