"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "../../lib/supabaseClient";

function extractUrl(url: string, title: string, text: string) {
  const direct = url?.trim();
  if (direct) return direct;

  const joined = `${title}\n${text}`;
  const match = joined.match(/https?:\/\/[^\s]+/i);
  return match?.[0]?.trim() || "";
}

export default function ShareClient({
  url,
  title,
  text,
}: {
  url: string;
  title: string;
  text: string;
}) {
  const sharedUrl = useMemo(() => extractUrl(url, title, text), [url, title, text]);

  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const run = async () => {
      if (!sharedUrl) {
        setStatus("error");
        setMessage("No URL received. Try sharing again.");
        return;
      }

      setStatus("saving");
      setMessage("Saving…");

      const { error } = await supabase.from("items").insert([
        { url: sharedUrl, category: "Uncategorized", state: "UNREAD" },
      ]);

      if (error) {
        setStatus("error");
        setMessage(error.message);
        return;
      }

      setStatus("saved");
      setMessage("Saved ✅ You can close this tab.");
      setTimeout(() => window.close(), 1200);
    };

    run();
  }, [sharedUrl]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-xl border bg-white p-5">
        <div className="text-lg font-semibold">Curio</div>
        <div className="mt-1 text-sm text-gray-600">
          {status === "saving" && "Saving your link…"}
          {status === "saved" && "Saved!"}
          {status === "error" && "Could not save"}
        </div>

        <div className="mt-4 rounded-lg bg-gray-50 p-3 text-sm break-words">
          {sharedUrl || "—"}
        </div>

        <div
          className={`mt-4 rounded-lg p-3 text-sm ${
            status === "error"
              ? "bg-red-50 text-red-700 border border-red-200"
              : "bg-green-50 text-green-700 border border-green-200"
          }`}
        >
          {message}
        </div>

        <div className="mt-4 flex gap-2">
          <a
            href="/"
            className="w-full rounded-lg border px-3 py-2 text-center text-sm hover:bg-gray-50"
          >
            Go to Inbox
          </a>
          <button
            onClick={() => window.close()}
            className="w-full rounded-lg bg-black px-3 py-2 text-sm text-white"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}