"use client";

import { useCallback, useRef, useState } from "react";

import {
  CONTACT_MAP_MAX_ZOOM,
  CONTACT_MAP_MIN_ZOOM,
} from "@/lib/contact-map-hero";

import { ContactMapZoomControls } from "./contact-map-zoom-controls";
import { ContactServiceMap } from "./contact-service-map";

export function ContactHeroMap() {
  const mapRef = useRef<import("leaflet").LeafletMap | null>(null);
  const userAdjustedZoomRef = useRef(false);
  const [zoomLevel, setZoomLevel] = useState(10);

  const handleMapReady = useCallback((map: import("leaflet").LeafletMap) => {
    mapRef.current = map;
    setZoomLevel(map.getZoom());
    map.on("zoomend", () => {
      setZoomLevel(map.getZoom());
    });
  }, []);

  const handleZoomIn = useCallback(() => {
    if (!mapRef.current) return;
    if (mapRef.current.getZoom() >= CONTACT_MAP_MAX_ZOOM) return;
    userAdjustedZoomRef.current = true;
    mapRef.current.zoomIn();
  }, []);

  const handleZoomOut = useCallback(() => {
    if (!mapRef.current) return;
    if (mapRef.current.getZoom() <= CONTACT_MAP_MIN_ZOOM) return;
    userAdjustedZoomRef.current = true;
    mapRef.current.zoomOut();
  }, []);

  return (
    <>
      <div className="absolute inset-0 z-0" aria-hidden>
        <ContactServiceMap
          userAdjustedZoomRef={userAdjustedZoomRef}
          onMapReady={handleMapReady}
        />
      </div>
      <ContactMapZoomControls
        zoom={zoomLevel}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
      />
    </>
  );
}
