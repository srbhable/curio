"use client";

export const dynamic = "force-dynamic";
export const revalidate = 0;

import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";

export default function SharePage() {
  const params = useSearchParams();

  // URL received from Android share intent -> /share?url=...
  const sharedUrl = useMemo(() => params.get("url") || "", [params]);

  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">(
    "idle"
  );
  const [message, setMessage] = useState<string>("");

  // Prevent double insert in React Strict Mode (dev)
  const hasSavedRef = useRef(false);

  useEffect(() => {
    const run = async () => {
      if (!sharedUrl) {
        setStatus("error");
        setMessage("No URL received. Try sharing again.");
        return;
      }

      if (hasSavedRef.current) return;
      hasSavedRef.current = true;

      setStatus("saving");
      setMessage("Saving…");

      try {
        const { error } = await supabase.from("items").insert([
          {
            url: sharedUrl,
            category: "Uncategorized",
            state: "UNREAD",
          },
        ]);

        if (error) {
          setStatus("error");
          setMessage(error.message);
          return;
        }

        setStatus("saved");
        setMessage("Saved ✅ You can close this tab.");

        // Optional: auto-close after 1.2s (works in some browsers)
        setTimeout(() => {
          if (typeof window !== "undefined") window.close();
        }, 1200);
      } catch (e: any) {
        setStatus("error");
        setMessage(e?.message || "Unknown error while saving.");
      }
    };

    run();
  }, [sharedUrl]);

  const isError = status === "error";
  const isSaving = status === "saving";
  const isSaved = status === "saved";

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-xl border bg-white p-5">
        <div className="text-lg font-semibold">Curio</div>
        <div className="mt-1 text-sm text-gray-600">
          {isSaving && "Saving your link…"}
          {isSaved && "Saved!"}
          {isError && "Could not save"}
          {status === "idle" && "Waiting for link…"}
        </div>

        <div className="mt-4 rounded-lg bg-gray-50 p-3 text-sm break-words">
          {sharedUrl || "—"}
        </div>

        {message ? (
          <div
            className={`mt-4 rounded-lg p-3 text-sm border ${
              isError
                ? "bg-red-50 text-red-700 border-red-200"
                : "bg-green-50 text-green-700 border-green-200"
            }`}
          >
            {message}
          </div>
        ) : null}

        <div className="mt-4 flex gap-2">
          <a
            href="/"
            className="w-full rounded-lg border px-3 py-2 text-center text-sm hover:bg-gray-50"
          >
            Go to Inbox
          </a>

          <button
            onClick={() => {
              if (typeof window !== "undefined") window.close();
            }}
            className="w-full rounded-lg bg-black px-3 py-2 text-sm text-white"
          >
            Close
          </button>
        </div>

        <div className="mt-3 text-xs text-gray-500">
          Tip: If this tab doesn’t close automatically, just tap Back.
        </div>
      </div>
    </div>
  );
}