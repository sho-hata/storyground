import { auth } from "@/lib/auth";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = req.nextUrl.searchParams.get("url");
  if (!url) {
    return Response.json({ error: "url is required" }, { status: 400 });
  }

  const res = await fetch(url, { next: { revalidate: 0 } });
  if (!res.ok) {
    return Response.json({ error: "Failed to fetch" }, { status: res.status });
  }

  const data = await res.json();
  return Response.json(data);
}
