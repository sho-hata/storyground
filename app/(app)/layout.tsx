import { auth, signOut, isDebugAuth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session) redirect("/login");

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-gray-800 bg-gray-900 px-6 py-3 flex items-center justify-between shrink-0">
        <Link href="/projects" className="text-white font-bold text-lg">
          Storyground
        </Link>
        <div className="flex items-center gap-4">
          {session.user?.image && (
            <img
              src={session.user.image}
              alt={session.user.name ?? ""}
              className="w-7 h-7 rounded-full"
            />
          )}
          <span className="text-gray-400 text-sm">
            {session.user?.name}
            {isDebugAuth && (
              <span className="ml-2 text-xs text-yellow-500 bg-yellow-900/30 px-1.5 py-0.5 rounded">
                DEBUG
              </span>
            )}
          </span>
          {!isDebugAuth && (
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/login" });
              }}
            >
              <button
                type="submit"
                className="text-gray-400 hover:text-white text-sm transition-colors"
              >
                ログアウト
              </button>
            </form>
          )}
        </div>
      </header>
      <main className="flex-1 flex flex-col">{children}</main>
    </div>
  );
}
