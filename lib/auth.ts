import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import type { Session } from "next-auth";

if (process.env.AUTH_DEBUG === "true" && process.env.NODE_ENV === "production") {
  throw new Error("AUTH_DEBUG must not be enabled in production");
}

export const isDebugAuth =
  process.env.AUTH_DEBUG === "true" && process.env.NODE_ENV !== "production";

export const {
  handlers,
  auth: nextAuth,
  signIn,
  signOut,
} = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    session({ session, user }) {
      session.user.id = user.id;
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
});

const DEBUG_USER = {
  id: "debug-user",
  name: "Debug User",
  email: "debug@localhost",
  image: null,
} as const;

const debugSession: Session = {
  user: DEBUG_USER,
  expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
};

/**
 * DB に debug ユーザーが存在しない場合は upsert する
 */
async function ensureDebugUser() {
  await prisma.user.upsert({
    where: { id: DEBUG_USER.id },
    update: {},
    create: {
      id: DEBUG_USER.id,
      name: DEBUG_USER.name,
      email: DEBUG_USER.email,
    },
  });
}

/**
 * AUTH_DEBUG=true のときは DB ユーザーを自動作成し、固定セッションを返す。
 * それ以外は NextAuth のセッションを返す。
 */
export async function auth(): Promise<Session | null> {
  if (isDebugAuth) {
    await ensureDebugUser();
    return debugSession;
  }
  return nextAuth();
}
