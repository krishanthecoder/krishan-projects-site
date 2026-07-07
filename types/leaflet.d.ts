declare module "leaflet" {
  export type LatLngExpression = [number, number] | { lat: number; lng: number };

  export interface ZoomPanOptions {
    animate?: boolean;
  }

  export interface LeafletMap {
    setView(center: LatLngExpression, zoom?: number, options?: ZoomPanOptions): this;
    getZoom(): number;
    getMinZoom(): number;
    getMaxZoom(): number;
    zoomIn(): this;
    zoomOut(): this;
    invalidateSize(): this;
    remove(): void;
    on(type: "zoomend", handler: () => void): this;
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

  export interface ControlOptions {
    position?: "topleft" | "topright" | "bottomleft" | "bottomright";
  }

  export interface Control {
    addTo(map: LeafletMap): this;
  }

  export interface ControlConstructor {
    extend<T extends object>(
      props: T,
    ): new (options?: ControlOptions) => Control & T;
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
    Control: ControlConstructor;
    DomUtil: {
      create(
        tagName: string,
        className?: string,
        container?: HTMLElement,
      ): HTMLElement;
    };
    DomEvent: {
      on(
        el: HTMLElement,
        type: string,
        fn: (event: Event) => void,
      ): void;
      stopPropagation(event: Event): void;
      preventDefault(event: Event): void;
      disableClickPropagation(el: HTMLElement): void;
    };
  };

  export default leaflet;
}
