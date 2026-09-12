import { v as Link, x as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as districtByKey, d as placesInDistrict, l as photoSrc, p as useCatalog, s as mergePlace, t as AppShell } from "./app-shell-DYh-f0nW.mjs";
import { i as Route$2 } from "./router-BqzKM1KQ.mjs";
import { n as PlacePills, t as PlaceImage } from "./pills-B2lkUWjh.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/bezirk._key-BikWruXS.js
var import_jsx_runtime = require_jsx_runtime();
function BezirkPage() {
	const { key } = Route$2.useParams();
	const d = districtByKey(key);
	const patches = useCatalog((s) => s.patches);
	const customPlaces = useCatalog((s) => s.customPlaces);
	const districtPatches = useCatalog((s) => s.districtPatches);
	const hideSl = useCatalog((s) => s.hideSl);
	const list = placesInDistrict(key, customPlaces).map((p) => mergePlace(p, patches));
	if (!d) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Bezirk nicht gefunden." }) });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "m-0 font-sans text-xs uppercase tracking-[0.14em] text-mute",
			children: [d.num, " · Bezirk"]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "mt-1 font-serif text-4xl",
			children: d.name
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "max-w-[62ch] text-[18px] text-ink-soft",
			children: districtPatches[d.key]?.intro || d.intro
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-mute",
			children: districtPatches[d.key]?.fabric || d.fabric
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3",
			children: list.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("article", {
				className: "overflow-hidden rounded-[22px] border border-line bg-card",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/ort/$id",
					params: { id: p.id },
					className: "block text-ink no-underline",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlaceImage, {
						id: p.id,
						fallback: photoSrc(p),
						alt: p.name,
						className: "h-44 w-full object-cover"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "font-sans text-xs text-mute",
								children: p.id
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "m-0 text-lg",
								children: p.name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-2",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlacePills, { place: p })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-sm text-ink-soft",
								children: hideSl ? p.sieht : p.am_tisch
							})
						]
					})]
				})
			}, p.id))
		})
	] });
}
//#endregion
export { BezirkPage as component };
