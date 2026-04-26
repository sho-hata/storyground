import { auth } from "@/lib/auth";
import { NextRequest } from "next/server";

const PRIVATE_IP_RE =
  /^(127\.|10\.|172\.(1[6-9]|2\d|3[01])\.|192\.168\.|169\.254\.|::1$|fc00:|fe80:)/i;

function isSafeUrl(raw: string): boolean {
  let parsed: URL;
  try {
    parsed = new URL(raw);
  } catch {
    return false;
  }
  if (parsed.protocol !== "https:") return false;
  if (PRIVATE_IP_RE.test(parsed.hostname)) return false;
  return true;
}

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = req.nextUrl.searchParams.get("url");
  if (!url) {
    return Response.json({ error: "url is required" }, { status: 400 });
  }

  if (!isSafeUrl(url)) {
    return Response.json({ error: "Invalid or disallowed URL" }, { status: 400 });
  }

  const res = await fetch(url, { next: { revalidate: 0 } });
  if (!res.ok) {
    return Response.json({ error: "Failed to fetch" }, { status: res.status });
  }

  const data = await res.json();
  return Response.json(data);
}
