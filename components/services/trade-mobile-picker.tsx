"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Check, ChevronDown } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";

import { serviceOfferings } from "@/lib/services-content";

type TradeMobilePickerProps = {
  activeTradeId: string;
  onSelect: (tradeId: string) => void;
};

export function TradeMobilePicker({ activeTradeId, onSelect }: TradeMobilePickerProps) {
  const reduceMotion = useReducedMotion();
  const listboxId = useId();
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const activeService =
    serviceOfferings.find((service) => service.id === activeTradeId) ??
    serviceOfferings[0];

  const ActiveIcon = activeService?.icon;

  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event: MouseEvent | TouchEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("touchstart", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("touchstart", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const handleSelect = (tradeId: string) => {
    setIsOpen(false);
    // Wait for the list to unmount before measuring sticky offsets.
    window.setTimeout(() => onSelect(tradeId), 200);
  };

  if (!activeService || !ActiveIcon) return null;

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        id="services-mobile-picker-anchor"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={listboxId}
        className="flex w-full items-center gap-3 rounded-xl border border-graphite/15 bg-stone-white px-4 py-3.5 text-left shadow-sm transition hover:border-gold/35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2"
        onClick={() => setIsOpen((open) => !open)}
      >
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-parchment">
          <ActiveIcon className="h-4 w-4 text-gold" strokeWidth={1.75} aria-hidden />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-warm-mist">
            Jump to trade
          </span>
          <span className="block truncate text-sm font-bold text-graphite">
            {activeService.shortLabel}
          </span>
        </span>
        <ChevronDown
          className={`h-5 w-5 shrink-0 text-graphite/55 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
          aria-hidden
        />
      </button>

      <AnimatePresence initial={false}>
        {isOpen ? (
          <motion.div
            id={listboxId}
            role="listbox"
            aria-label="Jump to trade"
            initial={reduceMotion ? false : { opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: -6 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="absolute left-0 right-0 z-50 mt-2 rounded-xl border border-graphite/12 bg-stone-white py-1 shadow-lg"
          >
            {serviceOfferings.map((service) => {
              const Icon = service.icon;
              const isSelected = service.id === activeTradeId;

              return (
                <button
                  key={service.id}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  className={`flex w-full items-center gap-3 px-3 py-2.5 text-left text-sm font-semibold transition ${
                    isSelected
                      ? "bg-parchment text-graphite"
                      : "text-graphite/80 hover:bg-parchment/70 hover:text-graphite"
                  }`}
                  onClick={() => handleSelect(service.id)}
                >
                  <Icon className="h-4 w-4 shrink-0 text-gold" strokeWidth={1.75} aria-hidden />
                  <span className="flex-1">{service.shortLabel}</span>
                  {isSelected ? (
                    <Check className="h-4 w-4 shrink-0 text-gold" strokeWidth={2.5} aria-hidden />
                  ) : null}
                </button>
              );
            })}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
