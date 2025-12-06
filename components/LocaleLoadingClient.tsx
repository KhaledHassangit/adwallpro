"use client";

import { useEffect } from "react";

export default function LocaleLoadingClient() {
  useEffect(() => {
    const overlayId = "locale-loading-overlay";
    const el = document.getElementById(overlayId);
    if (!el) return;

    let removed = false;

    const fadeOut = () => {
      if (!el) return;
      el.style.transition = "opacity 260ms ease, visibility 260ms";
      el.style.opacity = "0";
      el.style.visibility = "hidden";
      setTimeout(() => {
        // Instead of removing the node (which can race with React's
        // hydration/unmount and cause removeChild errors), hide it and
        // mark it removed. This is a safe, idempotent operation.
        try {
          el.style.display = "none";
          el.setAttribute("data-locale-overlay-removed", "1");
        } catch (err) {
          // noop
        }
        removed = true;
      }, 300);
    };

    // Wait for fonts to be ready, with a safe timeout fallback.
    const fallback = setTimeout(() => {
      if (!removed) fadeOut();
    }, 1200);

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready
        .then(() => {
          clearTimeout(fallback);
          if (!removed) fadeOut();
        })
        .catch(() => {
          clearTimeout(fallback);
          if (!removed) fadeOut();
        });
    } else {
      // If Font Loading API is not available, remove overlay after fallback.
      // (fallback timer above handles it)
    }

    return () => {
      removed = true;
      clearTimeout(fallback);
    };
  }, []);

  return null;
}
