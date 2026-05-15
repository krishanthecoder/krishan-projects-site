/**
 * Injects the "Asset not in use" toggle into the published dist bundle.
 * patch-package only patches src/; Studio loads dist/.
 */
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const pluginDir = path.join(root, "node_modules", "sanity-plugin-media", "dist");

const mjsToggle = `}, STORAGE_KEY$unused = "sanity-plugin-media.showUnusedOnly", isUnusedOnlyFacet = (facet) => facet?.name === "inUse" && facet.operatorType === "is" && facet.value === "false", UnusedAssetsToggle = () => {
  const dispatch = useDispatch(), facets = useTypedSelector((state) => state.search.facets), inUseFacet = useMemo(() => facets.find((facet) => facet.name === "inUse"), [facets]), unusedOnly = isUnusedOnlyFacet(inUseFacet), restoredPreference = useRef(!1), setUnusedOnly = useCallback((enabled) => {
    dispatch(searchActions.facetsRemoveByName({ facetName: "inUse" })), enabled && dispatch(searchActions.facetsAdd({ facet: { ...inputs.inUse, operatorType: "is", value: "false" } })), typeof window !== "undefined" && window.localStorage.setItem(STORAGE_KEY$unused, enabled ? "1" : "0");
  }, [dispatch]);
  return useEffect(() => {
    if (!restoredPreference.current && typeof window !== "undefined") {
      restoredPreference.current = !0, window.localStorage.getItem(STORAGE_KEY$unused) === "1" && !isUnusedOnlyFacet(inUseFacet) && setUnusedOnly(!0);
    }
  }, [inUseFacet, setUnusedOnly]), /* @__PURE__ */ jsx(Button, { fontSize: 1, mode: unusedOnly ? "default" : "ghost", onClick: () => setUnusedOnly(!unusedOnly), text: "Asset not in use", tone: unusedOnly ? "primary" : "default" });
}, Controls = () => {`;

const jsToggle = `}, STORAGE_KEY$unused = "sanity-plugin-media.showUnusedOnly", isUnusedOnlyFacet = (facet) => facet?.name === "inUse" && facet.operatorType === "is" && facet.value === "false", UnusedAssetsToggle = () => {
  const dispatch = reactRedux.useDispatch(), facets = useTypedSelector((state) => state.search.facets), inUseFacet = react.useMemo(() => facets.find((facet) => facet.name === "inUse"), [facets]), unusedOnly = isUnusedOnlyFacet(inUseFacet), restoredPreference = react.useRef(!1), setUnusedOnly = react.useCallback((enabled) => {
    dispatch(searchActions.facetsRemoveByName({ facetName: "inUse" })), enabled && dispatch(searchActions.facetsAdd({ facet: { ...inputs.inUse, operatorType: "is", value: "false" } })), typeof window !== "undefined" && window.localStorage.setItem(STORAGE_KEY$unused, enabled ? "1" : "0");
  }, [dispatch]);
  return react.useEffect(() => {
    if (!restoredPreference.current && typeof window !== "undefined") {
      restoredPreference.current = !0, window.localStorage.getItem(STORAGE_KEY$unused) === "1" && !isUnusedOnlyFacet(inUseFacet) && setUnusedOnly(!0);
    }
  }, [inUseFacet, setUnusedOnly]), /* @__PURE__ */ jsxRuntime.jsx(ui.Button, { fontSize: 1, mode: unusedOnly ? "default" : "ghost", onClick: () => setUnusedOnly(!unusedOnly), text: "Asset not in use", tone: unusedOnly ? "primary" : "default" });
}, Controls = () => {`;

const mjsSearchBox =
  '/* @__PURE__ */ jsx(Box, { marginX: 2, style: { minWidth: "200px" }, children: /* @__PURE__ */ jsx(TextInputSearch, {}) }),';
const mjsSearchBoxPatched = `${mjsSearchBox}
                  /* @__PURE__ */ jsx(Box, { marginX: 2, children: /* @__PURE__ */ jsx(UnusedAssetsToggle, {}) }),`;

const jsSearchBox =
  "/* @__PURE__ */ jsxRuntime.jsx(ui.Box, { marginX: 2, style: { minWidth: \"200px\" }, children: /* @__PURE__ */ jsxRuntime.jsx(TextInputSearch, {}) }),";
const jsSearchBoxPatched = `${jsSearchBox}
                  /* @__PURE__ */ jsxRuntime.jsx(ui.Box, { marginX: 2, children: /* @__PURE__ */ jsxRuntime.jsx(UnusedAssetsToggle, {}) }),`;

const mobileFiltersMjs =
  '/* @__PURE__ */ jsx(Box, { display: ["block", "block", "none"], marginX: 2, children: /* @__PURE__ */ jsxs(Inline, { space: 2, style: { whiteSpace: "nowrap" }, children: [\n                    /* @__PURE__ */ jsx(\n                      Button,\n                      {\n                        fontSize: 1,\n                        mode: "ghost",\n                        onClick: handleShowSearchFacetDialog,';
const mobileFiltersMjsPatched = mobileFiltersMjs.replace(
  "children: [\n                    /* @__PURE__ */ jsx(",
  "children: [\n                    /* @__PURE__ */ jsx(UnusedAssetsToggle, {}),\n                    /* @__PURE__ */ jsx(",
);

const mobileFiltersJs =
  '/* @__PURE__ */ jsxRuntime.jsx(ui.Box, { display: ["block", "block", "none"], marginX: 2, children: /* @__PURE__ */ jsxRuntime.jsxs(ui.Inline, { space: 2, style: { whiteSpace: "nowrap" }, children: [\n                    /* @__PURE__ */ jsxRuntime.jsx(\n                      ui.Button,\n                      {\n                        fontSize: 1,\n                        mode: "ghost",\n                        onClick: handleShowSearchFacetDialog,';
const mobileFiltersJsPatched = mobileFiltersJs.replace(
  "children: [\n                    /* @__PURE__ */ jsxRuntime.jsx(",
  "children: [\n                    /* @__PURE__ */ jsxRuntime.jsx(UnusedAssetsToggle, {}),\n                    /* @__PURE__ */ jsxRuntime.jsx(",
);

function patchFile(filename, { beforeControls, searchBox, searchBoxPatched, mobileBefore, mobileAfter }) {
  const filePath = path.join(pluginDir, filename);
  let content = readFileSync(filePath, "utf8");

  if (content.includes('text: "Asset not in use"')) {
    return false;
  }

  if (!content.includes("}, Controls = () => {")) {
    console.warn(`[patch-sanity-plugin-media-dist] Unexpected ${filename} format; skipping.`);
    return false;
  }

  content = content.replace("  ] });\n}, Controls = () => {", `  ] });\n${beforeControls}`);

  if (!content.includes(searchBox)) {
    console.warn(`[patch-sanity-plugin-media-dist] Search box anchor missing in ${filename}.`);
    return false;
  }

  content = content.replace(searchBox, searchBoxPatched);
  content = content.replace(mobileBefore, mobileAfter);

  writeFileSync(filePath, content);
  return true;
}

const mjsPatched = patchFile("index.mjs", {
  beforeControls: mjsToggle,
  searchBox: mjsSearchBox,
  searchBoxPatched: mjsSearchBoxPatched,
  mobileBefore: mobileFiltersMjs,
  mobileAfter: mobileFiltersMjsPatched,
});

const jsPatched = patchFile("index.js", {
  beforeControls: jsToggle,
  searchBox: jsSearchBox,
  searchBoxPatched: jsSearchBoxPatched,
  mobileBefore: mobileFiltersJs,
  mobileAfter: mobileFiltersJsPatched,
});

if (mjsPatched || jsPatched) {
  console.log("[patch-sanity-plugin-media-dist] Applied dist patches for Asset not in use toggle.");
} else {
  console.log("[patch-sanity-plugin-media-dist] Dist already patched.");
}
