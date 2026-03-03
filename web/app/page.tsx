"use client";

import { useEffect, useMemo, useState } from "react";
import AddLinkButton from "./components/AddLinkButton";
import { supabase } from "../lib/supabaseClient";

type Item = {
  id: string;
  url: string;
  title: string | null;
  source: string | null;
  author: string | null;
  category: string;
  state: string;
  one_liner: string | null;
  note: string | null;
  created_at: string;
};

export default function Home() {
  const categories = useMemo(
    () => [
      "Markets & Trading",
      "Business & Economy",
      "Tech & AI",
      "Science",
      "Books & Reading",
      "Career & Skills",
      "Health & Fitness",
      "Parenting & Family",
      "Psychology & Philosophy",
      "Travel & Leisure",
      "Money & Personal Finance",
      "Ideas / Misc",
    ],
    []
  );

  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [errMsg, setErrMsg] = useState<string | null>(null);

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      setErrMsg(null);

      const { data, error } = await supabase
        .from("items")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Supabase fetch error:", error);
        setItems([]);
        setErrMsg(error.message);
      } else {
        setItems(((data ?? []) as Item[]));
      }

      setLoading(false);
    };

    run();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2">
            <img
              src="/icon-192.png"
              alt="Curio Logo"
              className="h-8 w-8 rounded-lg"
            />
            <div>
              <div className="text-lg font-semibold leading-5">Curio</div>
              <div className="text-xs text-gray-500">Save. Organize. Think.</div>
            </div>
          </div>

          <AddLinkButton />
        </div>
      </header>

      <main className="mx-auto grid max-w-6xl grid-cols-12 gap-4 px-4 py-6">
        {/* Sidebar */}
        <aside className="col-span-12 md:col-span-4 lg:col-span-3">
          <div className="rounded-xl border bg-white p-4">
            <div className="mb-3 text-sm font-semibold">Categories</div>

            <div className="space-y-1">
              <button className="w-full rounded-lg bg-gray-100 px-3 py-2 text-left text-sm font-medium">
                Inbox (Unread)
              </button>
              <button className="w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-gray-50">
                Read
              </button>
              <button className="w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-gray-50">
                Archived
              </button>
            </div>

            <div className="my-4 h-px bg-gray-100" />

            <div className="max-h-[420px] space-y-1 overflow-auto pr-1">
              {categories.map((c) => (
                <button
                  key={c}
                  className="w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-gray-50"
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Content */}
        <section className="col-span-12 md:col-span-8 lg:col-span-9">
          <div className="rounded-xl border bg-white p-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="text-sm font-semibold">Inbox</div>
                <div className="text-xs text-gray-500">
                  Real items fetched from your database.
                </div>
              </div>

              <div className="flex w-full gap-2 md:w-auto">
                <input
                  placeholder="Search title, author, source..."
                  className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black/10 md:w-[320px]"
                />
                <select className="rounded-lg border px-3 py-2 text-sm">
                  <option>All categories</option>
                  {categories.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Loading */}
            {loading ? (
              <div className="mt-4 rounded-lg bg-gray-50 p-3 text-sm text-gray-600">
                Loading…
              </div>
            ) : null}

            {/* Error */}
            {errMsg ? (
              <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                Could not load items from Supabase. Error: {errMsg}
              </div>
            ) : null}

            {/* Items */}
            <div className="mt-4 space-y-3">
              {items.map((it) => (
                <div
                  key={it.id}
                  className="rounded-xl border p-4 hover:bg-gray-50"
                >
                  <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                    <div>
                      <div className="text-base font-semibold">
                        {it.title ?? it.url}
                      </div>

                      <div className="mt-1 text-xs text-gray-500">
                        {(it.source ?? "Unknown source")} •{" "}
                        {(it.author ?? "Unknown author")} • Saved:{" "}
                        {new Date(it.created_at).toLocaleString()} •{" "}
                        <span className="rounded-full bg-gray-100 px-2 py-0.5">
                          {it.category}
                        </span>{" "}
                        • <span className="font-medium">{it.state}</span>
                      </div>

                      <div className="mt-2 text-sm text-gray-700">
                        {it.one_liner ?? "No 1-line summary yet."}
                      </div>

                      {it.note ? (
                        <div className="mt-2 text-xs text-gray-500">
                          Note: {it.note}
                        </div>
                      ) : null}
                    </div>

                    <div className="flex flex-wrap gap-2 md:justify-end">
                      <a
                        href={it.url}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-lg border px-3 py-2 text-sm hover:bg-white"
                      >
                        Open
                      </a>

                      <button className="rounded-lg border px-3 py-2 text-sm hover:bg-white">
                        Summarize
                      </button>

                      <button className="rounded-lg border px-3 py-2 text-sm hover:bg-white">
                        Mark Read
                      </button>

                      <button className="rounded-lg border px-3 py-2 text-sm hover:bg-white">
                        Archive
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {!loading && !errMsg && items.length === 0 ? (
                <div className="rounded-lg bg-gray-50 p-3 text-sm text-gray-600">
                  No items yet. Add one in Supabase Table Editor to see it here.
                </div>
              ) : null}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}