declare module "leaflet" {
  export type LatLngExpression = [number, number] | { lat: number; lng: number };

  export interface LeafletMap {
    setView(center: LatLngExpression, zoom: number): this;
    invalidateSize(): this;
    remove(): void;
    scrollWheelZoom: {
      enable(): void;
      disable(): void;
    };
  }

  export interface DivIconOptions {
    className?: string;
    html?: string;
    iconSize?: [number, number];
    iconAnchor?: [number, number];
    popupAnchor?: [number, number];
  }

  export interface MapOptions {
    scrollWheelZoom?: boolean;
    zoomControl?: boolean;
    attributionControl?: boolean;
    dragging?: boolean;
    touchZoom?: boolean;
    doubleClickZoom?: boolean;
    boxZoom?: boolean;
    keyboard?: boolean;
    minZoom?: number;
    maxZoom?: number;
  }

  export interface TileLayerOptions {
    attribution?: string;
  }

  export interface MarkerOptions {
    icon?: DivIcon;
  }

  export interface DivIcon {
    options: DivIconOptions;
  }

  namespace DivIcon {
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface Options extends DivIconOptions {}
  }

  export interface ZoomControlOptions {
    position?: "topleft" | "topright" | "bottomleft" | "bottomright";
  }

  export interface Control {
    addTo(map: LeafletMap): this;
  }

  export interface Marker {
    addTo(map: LeafletMap): this;
  }

  export interface TileLayer {
    addTo(map: LeafletMap): this;
  }

  const leaflet: {
    map(element: HTMLElement, options?: MapOptions): LeafletMap;
    tileLayer(url: string, options?: TileLayerOptions): TileLayer;
    marker(latlng: LatLngExpression, options?: MarkerOptions): Marker;
    divIcon(options: DivIconOptions): DivIcon;
    control: {
      zoom(options?: ZoomControlOptions): Control;
    };
  };

  export default leaflet;
}
