"use client";

import { usePathname } from "next/navigation";
import { useEffect, useLayoutEffect, useRef } from "react";

export function RouteScrollReset() {
  const pathname = usePathname();
  const previousPathname = useRef<string | null>(null);
  const scrollKey = `scroll:${pathname}`;

  useEffect(() => {
    const persistScrollPosition = () => {
      sessionStorage.setItem(scrollKey, String(window.scrollY));
    };

    window.addEventListener("pagehide", persistScrollPosition);
    window.addEventListener("beforeunload", persistScrollPosition);

    return () => {
      window.removeEventListener("pagehide", persistScrollPosition);
      window.removeEventListener("beforeunload", persistScrollPosition);
    };
  }, [scrollKey]);

  useLayoutEffect(() => {
    if (previousPathname.current === null) {
      const navigationEntry = performance.getEntriesByType("navigation")[0] as
        | PerformanceNavigationTiming
        | undefined;

      if (navigationEntry?.type === "reload") {
        const savedScrollY = sessionStorage.getItem(scrollKey);
        if (savedScrollY) {
          const htmlElement = document.documentElement;
          const previousScrollBehavior = htmlElement.style.scrollBehavior;
          htmlElement.style.scrollBehavior = "auto";
          window.scrollTo(0, Number(savedScrollY));
          requestAnimationFrame(() => {
            htmlElement.style.scrollBehavior = previousScrollBehavior;
          });
        }
      }

      previousPathname.current = pathname;
      return;
    }

    if (previousPathname.current === pathname) {
      return;
    }

    const htmlElement = document.documentElement;
    const previousScrollBehavior = htmlElement.style.scrollBehavior;
    htmlElement.style.scrollBehavior = "auto";
    window.scrollTo(0, 0);

    requestAnimationFrame(() => {
      htmlElement.style.scrollBehavior = previousScrollBehavior;
    });

    previousPathname.current = pathname;
  }, [pathname, scrollKey]);

  return null;
}
