"use client";

import { useRef } from "react";

import { serviceOfferings } from "@/lib/services-content";

type TradeMobileNavProps = {
  activeTradeId: string;
  onSelect: (tradeId: string) => void;
};

export function TradeMobileNav({ activeTradeId, onSelect }: TradeMobileNavProps) {
  const tablistRef = useRef<HTMLDivElement>(null);

  const handleSelect = (tradeId: string, button: HTMLButtonElement) => {
    tablistRef.current
      ?.querySelectorAll<HTMLButtonElement>('[role="tab"]')
      .forEach((tab) => {
        if (tab !== button) {
          tab.blur();
        }
      });

    onSelect(tradeId);
    button.focus();
  };

  return (
    <nav aria-label="Browse trades">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">
        Browse trades
      </p>
      <div ref={tablistRef} role="tablist" className="mt-3 grid grid-cols-3 gap-2">
        {serviceOfferings.map((service) => {
          const Icon = service.icon;
          const isActive = activeTradeId === service.id;

          return (
            <button
              key={service.id}
              type="button"
              role="tab"
              id={`mobile-tab-${service.id}`}
              aria-selected={isActive}
              aria-controls={service.id}
              tabIndex={isActive ? 0 : -1}
              className={`flex cursor-default flex-col items-center gap-1.5 rounded-xl border-2 px-2 py-2.5 text-center transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 active:scale-[0.98] sm:px-3 sm:py-3 [@media(hover:hover)_and_(pointer:fine)]:cursor-pointer ${
                isActive
                  ? "border-gold bg-parchment text-graphite shadow-sm"
                  : "border-transparent bg-stone-white text-graphite/75 [@media(hover:hover)_and_(pointer:fine)]:hover:border-gold/50 [@media(hover:hover)_and_(pointer:fine)]:hover:bg-parchment/50 [@media(hover:hover)_and_(pointer:fine)]:hover:text-graphite"
              }`}
              onClick={(event) => handleSelect(service.id, event.currentTarget)}
            >
              <Icon
                className={`h-5 w-5 shrink-0 ${isActive ? "text-gold" : "text-gold/80"}`}
                strokeWidth={1.75}
                aria-hidden
              />
              <span className="text-[11px] font-semibold leading-tight sm:text-xs">
                {service.shortLabel}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
