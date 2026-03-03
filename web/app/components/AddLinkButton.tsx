"use client";

import { useState } from "react";

export default function AddLinkButton() {
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function onSubmit() {
    setMsg(null);
    setLoading(true);
    try {
      const res = await fetch("/api/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, note }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json?.error ?? "Failed");

      setUrl("");
      setNote("");
      setOpen(false);

      // simplest refresh so you see your new item from DB
      window.location.reload();
    } catch (e: any) {
      setMsg(e?.message ?? "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="rounded-lg bg-black px-3 py-2 text-sm font-medium text-white"
      >
        + Add Link
      </button>

      {open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-4 shadow-lg">
            <div className="text-base font-semibold">Add a link</div>
            <div className="mt-1 text-xs text-gray-500">
              Paste a URL for now. Share-sheet capture comes next.
            </div>

            <div className="mt-4 space-y-3">
              <input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://..."
                className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black/10"
              />
              <input
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Optional note"
                className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black/10"
              />

              {msg ? (
                <div className="rounded-lg bg-gray-50 p-2 text-sm text-gray-700">
                  {msg}
                </div>
              ) : null}

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setOpen(false)}
                  className="rounded-lg border px-3 py-2 text-sm"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  onClick={onSubmit}
                  className="rounded-lg bg-black px-3 py-2 text-sm font-medium text-white disabled:opacity-60"
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Save"}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}