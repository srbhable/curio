// web/app/share/route.ts
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const formData = await request.formData();

  // These keys come from manifest.share_target.params
  const url = String(formData.get("url") || "");
  const title = String(formData.get("title") || "");
  const text = String(formData.get("text") || "");

  // If Android didn't send URL for some reason
  if (!url) {
    return NextResponse.redirect(new URL("/share?error=missing_url", request.url), 303);
  }

  // Redirect to your existing GET-based share page
  const redirectUrl = new URL("/share", request.url);
  redirectUrl.searchParams.set("url", url);

  // (Optional) pass title/text too
  if (title) redirectUrl.searchParams.set("title", title);
  if (text) redirectUrl.searchParams.set("text", text);

  return NextResponse.redirect(redirectUrl, 303);
}