import {
  CONTACT_MAP_DEFAULT_CENTER,
  CONTACT_MAP_DEFAULT_ZOOM,
  CONTACT_MAP_MAX_ZOOM,
  CONTACT_MAP_MIN_ZOOM,
} from "@/lib/contact-map-hero";
import type { ServiceAreaLocation } from "@/lib/service-area-locations";

/** Above this width the map uses the default desktop center/zoom unchanged. */
const NARROW_MAP_MAX_WIDTH = 768;

/** Calibrate pin placement from the desktop view at this width (just above the breakpoint). */
const REFERENCE_MAP_WIDTH = 769;

const TILE_SIZE = 256;
const PIN_ICON_HALF_WIDTH = 14;
const MIN_RIGHT_INSET_PX = 12;

function pixelsPerLongitudeDegree(latitude: number, zoom: number): number {
  const latRad = (latitude * Math.PI) / 180;
  return ((TILE_SIZE * 2 ** zoom) / 360) * Math.cos(latRad);
}

function pinAnchorXFromLeft(
  mapWidth: number,
  centerLng: number,
  pin: Pick<ServiceAreaLocation, "lat" | "lng">,
  zoom: number,
): number {
  const pxPerDeg = pixelsPerLongitudeDegree(pin.lat, zoom);
  return mapWidth / 2 + (pin.lng - centerLng) * pxPerDeg;
}

/** Pin anchor X as a fraction of map width at the reference desktop view. */
function referencePinAnchorFraction(pin: Pick<ServiceAreaLocation, "lat" | "lng">): number {
  const anchorX = pinAnchorXFromLeft(
    REFERENCE_MAP_WIDTH,
    CONTACT_MAP_DEFAULT_CENTER[1],
    pin,
    CONTACT_MAP_DEFAULT_ZOOM,
  );
  return anchorX / REFERENCE_MAP_WIDTH;
}

function centerLngForAnchorX(
  mapWidth: number,
  pin: Pick<ServiceAreaLocation, "lat" | "lng">,
  zoom: number,
  targetAnchorX: number,
): number {
  const pxPerDeg = pixelsPerLongitudeDegree(pin.lat, zoom);
  return pin.lng - (targetAnchorX - mapWidth / 2) / pxPerDeg;
}

function zoomForNarrowMap(mapWidth: number): number {
  if (mapWidth < 640) return 9;
  return CONTACT_MAP_DEFAULT_ZOOM;
}

function getNarrowContactMapView(
  pin: Pick<ServiceAreaLocation, "lat" | "lng">,
  mapWidth: number,
) {
  const width = Math.max(mapWidth, 1);
  const zoom = Math.min(
    CONTACT_MAP_MAX_ZOOM,
    Math.max(CONTACT_MAP_MIN_ZOOM, zoomForNarrowMap(width)),
  );

  const anchorFraction = referencePinAnchorFraction(pin);
  const targetAnchorX = Math.min(
    width * anchorFraction,
    width - PIN_ICON_HALF_WIDTH - MIN_RIGHT_INSET_PX,
  );

  const centerLng = centerLngForAnchorX(width, pin, zoom, targetAnchorX);

  return {
    center: [CONTACT_MAP_DEFAULT_CENTER[0], centerLng] as [number, number],
    zoom,
  };
}

export function getContactMapView(
  pin: Pick<ServiceAreaLocation, "lat" | "lng">,
  mapWidth: number,
  _mapHeight: number,
) {
  if (mapWidth > NARROW_MAP_MAX_WIDTH) {
    return {
      center: CONTACT_MAP_DEFAULT_CENTER,
      zoom: CONTACT_MAP_DEFAULT_ZOOM,
    };
  }

  return getNarrowContactMapView(pin, mapWidth);
}
