import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const formData = await req.formData();

  const url = String(formData.get("url") ?? "");
  const title = String(formData.get("title") ?? "");
  const text = String(formData.get("text") ?? "");

  const redirectUrl = new URL("/share", req.url);

  if (url) redirectUrl.searchParams.set("url", url);
  if (title) redirectUrl.searchParams.set("title", title);
  if (text) redirectUrl.searchParams.set("text", text);

  return NextResponse.redirect(redirectUrl, { status: 303 });
}