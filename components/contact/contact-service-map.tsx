"use client";

import { useEffect, useRef, type RefObject } from "react";

import {
  CONTACT_MAP_MAX_ZOOM,
  CONTACT_MAP_MIN_ZOOM,
} from "@/lib/contact-map-hero";
import { getContactMapView } from "@/lib/contact-map-view";
import { SERVICE_AREA_LOCATIONS } from "@/lib/service-area-locations";

import { contactMapPinLeafletHtml } from "./contact-map-pin-icon";

import "leaflet/dist/leaflet.css";

const LAYOUT_WIDTH_THRESHOLD_PX = 16;

type ContactServiceMapProps = {
  userAdjustedZoomRef: RefObject<boolean>;
  onMapReady: (map: import("leaflet").LeafletMap) => void;
};

function createGoldPinIcon(L: typeof import("leaflet").default) {
  return L.divIcon({
    className: "",
    html: contactMapPinLeafletHtml(),
    iconSize: [28, 36],
    iconAnchor: [14, 36],
    popupAnchor: [0, -38],
  });
}

async function waitForElementSize(element: HTMLElement) {
  for (let attempt = 0; attempt < 40; attempt += 1) {
    if (element.clientWidth > 0 && element.clientHeight > 0) return;
    await new Promise<void>((resolve) => {
      requestAnimationFrame(() => resolve());
    });
  }
}

/** OpenStreetMap with a South Ockendon pin (client-only). */
export function ContactServiceMap({
  userAdjustedZoomRef,
  onMapReady,
}: ContactServiceMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let map: import("leaflet").LeafletMap | null = null;
    let cancelled = false;
    let container: HTMLDivElement | null = null;
    let lastLayoutWidth = -1;

    const onEnter = () => {
      map?.scrollWheelZoom.enable();
    };
    const onLeave = () => {
      map?.scrollWheelZoom.disable();
    };

    function applyMapView(resetZoom: boolean) {
      if (!map || !container || cancelled) return;
      const [southOckendon] = SERVICE_AREA_LOCATIONS;
      const { center, zoom } = getContactMapView(
        southOckendon,
        container.clientWidth,
        container.clientHeight,
      );
      const userAdjusted = userAdjustedZoomRef.current ?? false;
      const targetZoom = resetZoom && !userAdjusted ? zoom : map.getZoom();
      map.setView(center, targetZoom, { animate: false });
    }

    async function initMap() {
      container = containerRef.current;
      if (!container || cancelled) return;

      await waitForElementSize(container);
      if (cancelled) return;

      const L = (await import("leaflet")).default;
      if (cancelled) return;

      const [southOckendon] = SERVICE_AREA_LOCATIONS;
      const { center, zoom } = getContactMapView(
        southOckendon,
        container.clientWidth,
        container.clientHeight,
      );

      map = L.map(container, {
        scrollWheelZoom: false,
        zoomControl: false,
        attributionControl: true,
        dragging: true,
        touchZoom: true,
        doubleClickZoom: true,
        boxZoom: false,
        keyboard: false,
        minZoom: CONTACT_MAP_MIN_ZOOM,
        maxZoom: CONTACT_MAP_MAX_ZOOM,
      });

      container.addEventListener("mouseenter", onEnter);
      container.addEventListener("mouseleave", onLeave);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright" rel="noopener noreferrer">OpenStreetMap</a>',
      }).addTo(map);

      map.setView(center, zoom);

      const pinIcon = createGoldPinIcon(L);
      L.marker([southOckendon.lat, southOckendon.lng], { icon: pinIcon }).addTo(map);

      onMapReady(map);

      lastLayoutWidth = container.clientWidth;

      const resizeObserver = new ResizeObserver(() => {
        if (!map || !container || cancelled) return;
        const width = container.clientWidth;
        map.invalidateSize();
        if (
          lastLayoutWidth < 0 ||
          Math.abs(width - lastLayoutWidth) >= LAYOUT_WIDTH_THRESHOLD_PX
        ) {
          lastLayoutWidth = width;
          applyMapView(false);
        }
      });
      resizeObserver.observe(container);

      requestAnimationFrame(() => {
        if (!map || cancelled) return;
        map.invalidateSize();
        applyMapView(true);
        lastLayoutWidth = container!.clientWidth;
      });

      return () => {
        resizeObserver.disconnect();
      };
    }

    let cleanupResize: (() => void) | undefined;

    async function initMapWrapper() {
      cleanupResize = await initMap();
    }

    void initMapWrapper().catch((error: unknown) => {
      console.error("Contact map failed to load", error);
    });

    return () => {
      cancelled = true;
      cleanupResize?.();
      container?.removeEventListener("mouseenter", onEnter);
      container?.removeEventListener("mouseleave", onLeave);
      map?.remove();
      map = null;
    };
  }, [onMapReady, userAdjustedZoomRef]);

  return (
    <div
      ref={containerRef}
      className="contact-service-map h-full min-h-[280px] w-full"
      aria-hidden
    />
  );
}
