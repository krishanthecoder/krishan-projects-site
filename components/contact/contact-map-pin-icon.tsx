const GOLD = "#C4973D";
const GRAPHITE = "#333333";

/** Gold South Ockendon pin — shared by Leaflet divIcon markup. */
export function contactMapPinLeafletHtml() {
  return `<span class="contact-map-pin" aria-hidden="true">
      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="36" viewBox="0 0 28 36" fill="none">
        <path d="M14 0C6.82 0 1 5.82 1 13c0 9.75 13 23 13 23s13-13.25 13-23C27 5.82 21.18 0 14 0Z" fill="${GOLD}" stroke="${GRAPHITE}" stroke-width="1.5"/>
        <circle cx="14" cy="13" r="4.5" fill="${GRAPHITE}"/>
      </svg>
    </span>`;
}
