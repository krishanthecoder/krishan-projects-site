"use client";

import { ContactServiceMap } from "./contact-service-map";

export function ContactHeroMap() {
  return (
    <div className="absolute inset-0 z-0" aria-hidden>
      <ContactServiceMap />
    </div>
  );
}
