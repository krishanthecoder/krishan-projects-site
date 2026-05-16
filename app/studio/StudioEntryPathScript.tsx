import Script from "next/script";

import { STUDIO_ENTRY_PATH_STORAGE_KEY } from "@/sanity/structurePaneIds";

/** Records the first Studio URL in this tab before Sanity rewrites the path. */
export function StudioEntryPathScript() {
  return (
    <Script
      id="sanity-studio-entry-path"
      strategy="beforeInteractive"
      dangerouslySetInnerHTML={{
        __html: `(function(){try{var k=${JSON.stringify(STUDIO_ENTRY_PATH_STORAGE_KEY)};if(!sessionStorage.getItem(k)){sessionStorage.setItem(k,location.pathname)}}catch(e){}})();`,
      }}
    />
  );
}
