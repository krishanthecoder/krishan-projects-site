/** Service-area pins shown on the contact page map. */
export type ServiceAreaLocation = {
  name: string;
  lat: number;
  lng: number;
};

export const SERVICE_AREA_LOCATIONS: ServiceAreaLocation[] = [
  { name: "South Ockendon", lat: 51.508, lng: 0.2887 },
];
