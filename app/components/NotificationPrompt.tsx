"use client";

import { useEffect, useState } from "react";

type Status = "loading" | "unsupported" | "default" | "granted" | "denied";

export default function NotificationPrompt() {
  const [status, setStatus] = useState<Status>("loading");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!("Notification" in window) || !("serviceWorker" in navigator)) {
      setStatus("unsupported");
      return;
    }
    setStatus(Notification.permission as Status);

    // Already granted earlier: make sure the SW is registered
    if (Notification.permission === "granted") {
      navigator.serviceWorker.register("/sw.js").catch(console.error);
    }
  }, []);

  async function handleEnable() {
    setBusy(true);
    try {
      const permission = await Notification.requestPermission();
      setStatus(permission as Status);

      if (permission === "granted") {
        const registration = await navigator.serviceWorker.register("/sw.js");
        console.log("[PWA] Service worker registered:", registration.scope);
      }
    } catch (error) {
      console.error("[PWA] Notification setup failed:", error);
    } finally {
      setBusy(false);
    }
  }

  if (status === "loading" || status === "unsupported") return null;

  return (
    <div className="w-full max-w-md rounded-2xl border border-(--border) bg-(--surface) p-5 shadow-lg shadow-black/40">
      <div className="flex items-start gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-500/15 text-violet-400">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5"
            aria-hidden="true"
          >
            <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
            <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
          </svg>
        </div>

        <div className="flex-1">
          <h3 className="text-sm font-semibold text-white">
            Renewal reminders
          </h3>

          {status === "default" && (
            <>
              <p className="mt-1 text-sm text-zinc-400">
                Get notified before your subscriptions renew, right on your
                device.
              </p>
              <button
                onClick={handleEnable}
                disabled={busy}
                className="mt-4 inline-flex items-center rounded-lg bg-(--accent) px-4 py-2 text-sm font-medium text-white transition hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400/60 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {busy ? "Enabling…" : "Enable Notifications"}
              </button>
            </>
          )}

          {status === "granted" && (
            <p className="mt-1 text-sm text-emerald-400">
              Notifications are on. You're all set.
            </p>
          )}

          {status === "denied" && (
            <p className="mt-1 text-sm text-zinc-400">
              Notifications are blocked. Enable them from your browser's site
              settings to get renewal alerts.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
