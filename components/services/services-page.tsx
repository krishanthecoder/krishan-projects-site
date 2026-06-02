"use client";

import Link from "next/link";
import { LayoutGroup, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { useScrollSpy } from "@/hooks/use-scroll-spy";
import { serviceOfferings, type ServiceOffering } from "@/lib/services-content";
import { scrollToSectionAligned, getSiteHeaderScrollOffset } from "@/lib/scroll-to-section";

import { TradeMobileNav } from "./trade-mobile-nav";
import type { ServicesPageProps } from "./types";

const tradeMarkerId = (tradeId: string) => `${tradeId}-marker`;

const tradeNavRowClass =
  "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold";

const sidebarActiveTransition = {
  type: "spring" as const,
  stiffness: 380,
  damping: 34,
  mass: 0.85,
};

function TradeNavRow({
  service,
  className = "",
}: {
  service: ServiceOffering;
  className?: string;
}) {
  const Icon = service.icon;

  return (
    <>
      <Icon
        className="h-4 w-4 shrink-0 text-gold opacity-80"
        aria-hidden
      />
      <span className={className}>{service.shortLabel}</span>
    </>
  );
}

function TradeSidebarLink({
  service,
  isActive,
  reduceMotion,
  onSelect,
}: {
  service: ServiceOffering;
  isActive: boolean;
  reduceMotion: boolean | null;
  onSelect: () => void;
}) {
  return (
    <li className="relative">
      {isActive &&
        (reduceMotion ? (
          <span
            className="absolute inset-0 rounded-xl border-l-[3px] border-gold bg-parchment shadow-sm"
            aria-hidden
          />
        ) : (
          <motion.span
            layoutId="services-trade-active"
            className="absolute inset-0 rounded-xl border-l-[3px] border-gold bg-parchment shadow-sm"
            transition={sidebarActiveTransition}
            aria-hidden
          />
        ))}
      <button
        type="button"
        id={`nav-${service.id}`}
        aria-current={isActive ? "true" : undefined}
        className={`relative z-[1] cursor-pointer ${tradeNavRowClass} transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 ${
          isActive
            ? "text-graphite"
            : "text-graphite/75 hover:bg-parchment/50 hover:text-graphite"
        }`}
        onClick={onSelect}
      >
        <TradeNavRow service={service} />
      </button>
    </li>
  );
}

function ServiceDetailArticle({
  service,
  layoutIndex,
  isMobileActive,
  isDesktopLayout,
}: {
  service: ServiceOffering;
  layoutIndex: number;
  isMobileActive: boolean;
  isDesktopLayout: boolean;
}) {
  const Icon = service.icon;
  const isEven = layoutIndex % 2 === 0;
  const hideOnMobile = !isDesktopLayout && !isMobileActive;

  return (
    <article
      id={service.id}
      role={isDesktopLayout ? undefined : "tabpanel"}
      aria-labelledby={isDesktopLayout ? undefined : `mobile-tab-${service.id}`}
      aria-hidden={hideOnMobile ? true : undefined}
      className={`relative${isDesktopLayout ? " scroll-mt-32" : " max-lg:scroll-mt-0"}${hideOnMobile ? " max-lg:hidden" : ""}`}
    >
      {isDesktopLayout ? (
        <div
          id={tradeMarkerId(service.id)}
          className="pointer-events-none absolute left-0 top-0 h-0 w-px"
          aria-hidden
        />
      ) : null}
      <div
        className={`relative grid gap-8 lg:grid-cols-2 lg:items-start ${
          isEven ? "" : "lg:[&>*:first-child]:order-2"
        }`}
      >
        <FeatureCard isEven={isEven} service={service} Icon={Icon} />
        <div className="lg:pt-4">
          <p className="text-sm leading-relaxed text-graphite/85">{service.description}</p>
          <div className="mt-6 border-t border-graphite/10 pt-6">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-warm-mist">
              Typical scope
            </p>
            <ul className="mt-3 space-y-2.5">
              {service.includes.map((item) => (
                <li
                  key={item}
                  className="flex gap-2.5 text-sm leading-snug text-graphite/85"
                >
                  <Check
                    className="mt-0.5 h-4 w-4 shrink-0 text-gold"
                    strokeWidth={2.5}
                    aria-hidden
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </article>
  );
}

function FeatureCard({
  service,
  isEven,
  Icon,
}: {
  service: ServiceOffering;
  isEven: boolean;
  Icon: ServiceOffering["icon"];
}) {
  return (
    <div
      className={`rounded-3xl p-8 sm:p-10 ${
        isEven
          ? "bg-graphite text-stone-white"
          : "border border-graphite/10 bg-parchment text-graphite"
      }`}
    >
      <Icon className="h-10 w-10 text-gold" strokeWidth={1.75} aria-hidden />
      <p className="mt-6 text-xs font-semibold uppercase tracking-[0.2em] text-gold">
        {service.shortLabel}
      </p>
      <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
        {service.title}
      </h2>
      <p
        className={`mt-4 text-base font-medium leading-relaxed ${
          isEven ? "text-stone-white/90" : "text-graphite/90"
        }`}
      >
        {service.summary}
      </p>
    </div>
  );
}

/** Services page — sidebar scrollspy + trade detail sections. */
export function ServicesPageContent({
  primaryArea,
  serviceAreasLabel,
  phoneNumber,
}: ServicesPageProps) {
  const reduceMotion = useReducedMotion();
  const telHref = `tel:${phoneNumber.replace(/\s/g, "")}`;
  const tradeNavAnchorRef = useRef<HTMLParagraphElement>(null);

  const tradeSectionIds = useMemo(
    () => serviceOfferings.map((service) => service.id),
    [],
  );

  const getTradeAnchorTop = useCallback(() => {
    const anchor = tradeNavAnchorRef.current;
    if (!anchor) return getSiteHeaderScrollOffset();
    return anchor.getBoundingClientRect().top;
  }, []);

  /** Sidebar clicks must clear the site header; spy still uses the browse heading. */
  const getTradeScrollOffset = useCallback(() => {
    return Math.max(getSiteHeaderScrollOffset(), getTradeAnchorTop());
  }, [getTradeAnchorTop]);

  const getTradeMarker = useCallback((tradeId: string) => {
    return document.getElementById(tradeMarkerId(tradeId));
  }, []);

  const getTradeSection = useCallback((tradeId: string) => {
    return document.getElementById(tradeId);
  }, []);

  const [isDesktopLayout, setIsDesktopLayout] = useState(false);
  const [mobileTradeId, setMobileTradeId] = useState(() => {
    if (typeof window === "undefined") {
      return serviceOfferings[0].id;
    }

    const hash = window.location.hash.slice(1);
    return serviceOfferings.some((service) => service.id === hash)
      ? hash
      : serviceOfferings[0].id;
  });

  const scrollTradeIntoView = useCallback(
    (tradeId: string, behavior: ScrollBehavior) => {
      const section = getTradeSection(tradeId);
      if (!section) return;
      scrollToSectionAligned(section, getTradeScrollOffset(), { behavior });
    },
    [getTradeScrollOffset, getTradeSection],
  );

  const applyTradeFromHash = useCallback(() => {
    const hash = window.location.hash.slice(1);
    if (!tradeSectionIds.includes(hash)) return;

    setMobileTradeId(hash);

    if (window.matchMedia("(min-width: 1024px)").matches) {
      scrollTradeIntoView(hash, "auto");
    }
  }, [tradeSectionIds, scrollTradeIntoView]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1024px)");
    const updateLayout = () => setIsDesktopLayout(mediaQuery.matches);

    updateLayout();
    mediaQuery.addEventListener("change", updateLayout);
    return () => mediaQuery.removeEventListener("change", updateLayout);
  }, []);

  useEffect(() => {
    applyTradeFromHash();
    window.addEventListener("hashchange", applyTradeFromHash);
    return () => window.removeEventListener("hashchange", applyTradeFromHash);
  }, [applyTradeFromHash]);

  const scrollSpyTradeId = useScrollSpy(tradeSectionIds, {
    offset: getTradeAnchorTop,
    enabled: isDesktopLayout,
    mode: "anchored-visibility",
    getMarkerElement: getTradeMarker,
    getSectionElement: getTradeSection,
  });

  const scrollToTrade = useCallback(
    (tradeId: string) => {
      scrollTradeIntoView(tradeId, reduceMotion ? "auto" : "smooth");
    },
    [reduceMotion, scrollTradeIntoView],
  );

  const handleMobileTradeSelect = useCallback((tradeId: string) => {
    setMobileTradeId(tradeId);

    if (window.matchMedia("(max-width: 1023px)").matches) {
      window.history.replaceState(null, "", `#${tradeId}`);
    }
  }, []);

  return (
    <>
      <section aria-labelledby="services-trades-heading">
        <h2
          id="services-trades-heading"
          className="text-xl font-bold tracking-tight text-graphite sm:text-2xl"
        >
          Our trades
        </h2>
        <p className="mt-1 text-sm text-warm-mist lg:max-w-xl">
          <span className="lg:hidden">Tap a trade to see what we cover on your job.</span>
          <span className="hidden lg:inline">
            Jump to a trade in the sidebar, or scroll through each section below.
          </span>
        </p>

        <div
          id="services-mobile-trade-picker"
          className="mt-6 border-b border-graphite/8 pb-3 lg:hidden"
        >
          <TradeMobileNav
            activeTradeId={mobileTradeId}
            onSelect={handleMobileTradeSelect}
          />
        </div>

        <div className="mt-6 lg:mt-10 lg:grid lg:grid-cols-[minmax(12.5rem,14rem)_minmax(0,1fr)] lg:items-start lg:gap-10 xl:gap-14">
          <nav
            aria-label="Browse by trade"
            className="hidden lg:block lg:sticky lg:top-24 lg:self-start"
          >
            <p
              ref={tradeNavAnchorRef}
              id="services-trade-nav-anchor"
              className="text-xs font-semibold uppercase tracking-[0.18em] text-gold"
            >
              Browse by trade
            </p>
            <LayoutGroup id="services-trade-nav">
              <ul className="mt-4 space-y-1">
                {serviceOfferings.map((service) => (
                  <TradeSidebarLink
                    key={service.id}
                    service={service}
                    isActive={scrollSpyTradeId === service.id}
                    reduceMotion={reduceMotion}
                    onSelect={() => scrollToTrade(service.id)}
                  />
                ))}
              </ul>
            </LayoutGroup>
          </nav>

          <div
            id="services-trades-panel"
            className="mt-6 space-y-16 lg:mt-0 lg:space-y-20"
          >
            {serviceOfferings.map((service, index) => (
              <ServiceDetailArticle
                key={service.id}
                service={service}
                layoutIndex={index}
                isMobileActive={mobileTradeId === service.id}
                isDesktopLayout={isDesktopLayout}
              />
            ))}
          </div>
        </div>
      </section>

      <section
        className="relative mt-16 overflow-hidden rounded-3xl sm:mt-20"
        aria-labelledby="services-cta-heading"
      >
        <div
          className="absolute inset-0 bg-gradient-to-br from-gold via-gold to-gold/80"
          aria-hidden
        />
        <div
          className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-stone-white/15 blur-2xl"
          aria-hidden
        />
        <div className="relative grid gap-8 p-8 sm:p-10 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-white/70">
              Next step
            </p>
            <h2
              id="services-cta-heading"
              className="mt-3 text-2xl font-bold tracking-tight text-stone-white sm:text-3xl"
            >
              Not sure which trade you need first?
            </h2>
            <p className="mt-3 max-w-lg text-sm leading-relaxed text-stone-white/85">
              Describe what you are planning — an extension, a bathroom, a full
              redecoration, or something in between. We will visit, advise on the
              right order of works, and send a clear written quote.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-graphite px-6 py-3 text-sm font-bold text-stone-white shadow-lg transition hover:bg-graphite/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-white focus-visible:ring-offset-2 focus-visible:ring-offset-gold"
            >
              Request a quote
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <a
              href={telHref}
              className="inline-flex items-center justify-center rounded-xl border border-stone-white/40 bg-stone-white/10 px-6 py-3 text-sm font-semibold text-stone-white backdrop-blur-sm transition hover:bg-stone-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-white focus-visible:ring-offset-2 focus-visible:ring-offset-gold"
            >
              Call {phoneNumber}
            </a>
          </div>
        </div>
      </section>

      <p className="mt-10 text-center text-sm text-warm-mist">
        See recent work in our{" "}
        <Link
          href="/projects"
          className="font-semibold text-graphite underline decoration-gold/50 underline-offset-2 hover:decoration-gold"
        >
          project gallery
        </Link>
        .
      </p>
    </>
  );
}
