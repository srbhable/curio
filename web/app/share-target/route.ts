// web/app/share-target/route.ts
import { NextResponse } from "next/server";

function extractUrlFromAnyField(formData: FormData) {
  // 1) check common keys directly
  const directKeys = ["url", "link", "sharedUrl", "href"];
  for (const k of directKeys) {
    const v = formData.get(k);
    if (typeof v === "string" && v.trim().startsWith("http")) return v.trim();
  }

  // 2) scan every field value and try to find a URL anywhere
  const allValues: string[] = [];
  for (const [, v] of formData.entries()) {
    if (typeof v === "string" && v.trim()) allValues.push(v.trim());
  }

  const joined = allValues.join("\n");
  const match = joined.match(/https?:\/\/[^\s]+/i);
  return match?.[0]?.trim() || "";
}

export async function POST(req: Request) {
  const formData = await req.formData();

  // DEBUG: Log keys seen (check in Vercel -> Logs)
  console.log("share-target keys:", Array.from(formData.keys()));

  const url = extractUrlFromAnyField(formData);
  const title = (formData.get("title") as string | null) || "";
  const text = (formData.get("text") as string | null) || "";

  const redirectUrl = new URL("/share", req.url);

  if (url) redirectUrl.searchParams.set("url", url);
  if (title) redirectUrl.searchParams.set("title", title);
  if (text) redirectUrl.searchParams.set("text", text);

  return NextResponse.redirect(redirectUrl.toString(), 303);
}