"use client";

import { useEffect } from "react";

export function ServiceWorkerRegistration() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        // Registration failures shouldn't break the app; the site works
        // fine without offline support, it just won't be installable
        // as reliably.
      });
    }
  }, []);

  return null;
}
