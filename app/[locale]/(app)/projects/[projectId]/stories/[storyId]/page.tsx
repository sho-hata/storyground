import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import StoryViewerPage from "@/components/viewer/StoryViewerPage";

export default async function StoryPage({
  params,
}: {
  params: { projectId: string; storyId: string; locale: string };
}) {
  setRequestLocale(params.locale);
  const t = await getTranslations("story");

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
        <a
          href={`${story.project.storybookUrl.replace(/\/$/, "")}/?path=/story/${story.storyId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-auto flex items-center gap-1.5 text-xs font-medium text-white bg-[#FF4785] hover:bg-[#e03a76] rounded px-3 py-1.5 transition-colors"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M5 2H2a1 1 0 0 0-1 1v7a1 1 0 0 0 1 1h7a1 1 0 0 0 1-1V7" />
            <path d="M8 1h3v3" />
            <path d="M11 1 5.5 6.5" />
          </svg>
          {t("open_storybook")}
        </a>
      </div>
      <StoryViewerPage
        storyId={story.id}
        storyUrl={story.url}
        currentUserId={session!.user.id}
      />
    </div>
  );
}
