import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function mustGetEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env var: ${name}`);
  return v;
}

const supabase = createClient(
  mustGetEnv("NEXT_PUBLIC_SUPABASE_URL"),
  mustGetEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY")
);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const url = String(body?.url ?? "").trim();
    const note = String(body?.note ?? "").trim();

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    if (!/^https?:\/\//i.test(url)) {
      return NextResponse.json(
        { error: "URL must start with http:// or https://" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("items")
      .insert([{ url, note }])
      .select("id")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ ok: true, id: data.id });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message ?? "Unknown error" },
      { status: 500 }
    );
  }
}