"use client";

import { useEffect, useRef } from "react";

import {
  CONTACT_MAP_MAX_ZOOM,
  CONTACT_MAP_MIN_ZOOM,
} from "@/lib/contact-map-hero";
import { getContactMapView } from "@/lib/contact-map-view";
import { SERVICE_AREA_LOCATIONS } from "@/lib/service-area-locations";

import { contactMapPinLeafletHtml } from "./contact-map-pin-icon";

import "leaflet/dist/leaflet.css";

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
export function ContactServiceMap() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let map: import("leaflet").LeafletMap | null = null;
    let cancelled = false;
    let container: HTMLDivElement | null = null;

    const onEnter = () => {
      map?.scrollWheelZoom.enable();
    };
    const onLeave = () => {
      map?.scrollWheelZoom.disable();
    };

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

      L.control.zoom({ position: "topright" }).addTo(map);

      container.addEventListener("mouseenter", onEnter);
      container.addEventListener("mouseleave", onLeave);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright" rel="noopener noreferrer">OpenStreetMap</a>',
      }).addTo(map);

      map.setView(center, zoom);

      const pinIcon = createGoldPinIcon(L);
      L.marker([southOckendon.lat, southOckendon.lng], { icon: pinIcon }).addTo(map);

      requestAnimationFrame(() => {
        if (!map || cancelled) return;
        map.invalidateSize();
        const { center: nextCenter, zoom: nextZoom } = getContactMapView(
          southOckendon,
          container!.clientWidth,
          container!.clientHeight,
        );
        map.setView(nextCenter, nextZoom);
      });
    }

    void initMap().catch((error: unknown) => {
      console.error("Contact map failed to load", error);
    });

    return () => {
      cancelled = true;
      container?.removeEventListener("mouseenter", onEnter);
      container?.removeEventListener("mouseleave", onLeave);
      map?.remove();
      map = null;
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="contact-service-map h-full min-h-[280px] w-full"
      aria-hidden
    />
  );
}
