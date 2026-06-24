import {
  CONTACT_MAP_DEFAULT_CENTER,
  CONTACT_MAP_DEFAULT_ZOOM,
} from "@/lib/contact-map-hero";
import type { ServiceAreaLocation } from "@/lib/service-area-locations";

export function getContactMapView(
  _pin: Pick<ServiceAreaLocation, "lat" | "lng">,
  _mapWidth: number,
  _mapHeight: number,
) {
  return {
    center: CONTACT_MAP_DEFAULT_CENTER,
    zoom: CONTACT_MAP_DEFAULT_ZOOM,
  };
}
