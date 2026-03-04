import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const formData = await req.formData();

  const url = (formData.get("url") as string) || "";
  const title = (formData.get("title") as string) || "";
  const text = (formData.get("text") as string) || "";

  // Redirect to /share and pass the received fields as query params
  const redirectUrl = new URL("/share", req.url);

  if (url) redirectUrl.searchParams.set("url", url);
  if (title) redirectUrl.searchParams.set("title", title);
  if (text) redirectUrl.searchParams.set("text", text);

  return NextResponse.redirect(redirectUrl.toString(), { status: 303 });
}