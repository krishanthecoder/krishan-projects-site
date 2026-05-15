import { createStudioConfig } from "./sanity/studioConfig";

const config = createStudioConfig();

if (!config) {
  throw new Error(
    "Missing NEXT_PUBLIC_SANITY_PROJECT_ID. Add it to .env.local so Studio can connect.",
  );
}

export default config;
