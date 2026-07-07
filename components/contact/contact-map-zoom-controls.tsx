"use client";

import {
  CONTACT_MAP_MAX_ZOOM,
  CONTACT_MAP_MIN_ZOOM,
} from "@/lib/contact-map-hero";

type ContactMapZoomControlsProps = {
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
};

/** Map zoom buttons — React overlay (not Leaflet controls) for reliable mobile taps. */
export function ContactMapZoomControls({
  zoom,
  onZoomIn,
  onZoomOut,
}: ContactMapZoomControlsProps) {
  const atMax = zoom >= CONTACT_MAP_MAX_ZOOM;
  const atMin = zoom <= CONTACT_MAP_MIN_ZOOM;

  return (
    <div
      className="contact-map-zoom-controls pointer-events-none absolute inset-0 z-[3]"
      aria-hidden
    >
      <div className="contact-map-zoom-controls__group pointer-events-auto absolute bottom-11 right-2.5 md:bottom-auto md:top-2.5">
        <button
          type="button"
          className="contact-map-zoom-controls__button"
          aria-label="Zoom in"
          disabled={atMax}
          onClick={onZoomIn}
        >
          +
        </button>
        <button
          type="button"
          className="contact-map-zoom-controls__button"
          aria-label="Zoom out"
          disabled={atMin}
          onClick={onZoomOut}
        >
          &minus;
        </button>
      </div>
    </div>
  );
}
