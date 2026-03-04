// web/app/share-target/route.ts
import { NextResponse } from "next/server";

function pickUrl(formData: FormData) {
  const url =
    (formData.get("url") as string | null) ||
    (formData.get("link") as string | null) ||
    "";

  if (url) return url.trim();

  // fallback: sometimes URL is inside "text"
  const text = (formData.get("text") as string | null) || "";
  const match = text.match(/https?:\/\/[^\s]+/i);
  return match?.[0]?.trim() || "";
}

export async function POST(req: Request) {
  const formData = await req.formData();

  const url = pickUrl(formData);
  const title = ((formData.get("title") as string | null) || "").trim();
  const text = ((formData.get("text") as string | null) || "").trim();

  const redirectUrl = new URL("/share", req.url);

  if (url) redirectUrl.searchParams.set("url", url);
  if (title) redirectUrl.searchParams.set("title", title);
  if (text) redirectUrl.searchParams.set("text", text);

  return NextResponse.redirect(redirectUrl.toString(), 303);
}