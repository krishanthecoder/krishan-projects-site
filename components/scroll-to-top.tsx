"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ChevronUp } from "lucide-react";
import { useEffect, useState } from "react";

export function ScrollToTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 400);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible ? (
        <motion.button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-6 right-6 z-[80] inline-flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border border-gold/55 bg-gold/90 text-stone-white shadow-xl backdrop-blur-md transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-stone-white sm:bottom-8 sm:right-8"
          aria-label="Scroll back to the top of the page"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.2 }}
          whileHover={{
            scale: 1.04,
            boxShadow: "0 0 0 2px rgba(196, 151, 61, 0.18), 0 8px 16px rgba(0, 0, 0, 0.18)",
          }}
          whileTap={{ scale: 0.95 }}
        >
          <ChevronUp size={20} strokeWidth={2.6} aria-hidden="true" />
        </motion.button>
      ) : null}
    </AnimatePresence>
  );
}
