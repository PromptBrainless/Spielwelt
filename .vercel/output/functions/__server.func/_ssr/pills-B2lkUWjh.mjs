import { i as __toESM } from "../_runtime.mjs";
import { V as require_react, x as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as getPlaceImageUrl } from "./photos-Dgn3wn7V.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/pills-B2lkUWjh.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function PlaceImage({ id, fallback, alt, className, revision = 0, local = true }) {
	const [src, setSrc] = (0, import_react.useState)(fallback);
	const [broken, setBroken] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		let dead = false;
		let objectUrl = null;
		setBroken(false);
		if (!local) {
			setSrc(fallback);
			return;
		}
		getPlaceImageUrl(id, fallback).then((url) => {
			if (dead) return;
			if (url.startsWith("blob:")) objectUrl = url;
			setSrc(url);
		});
		return () => {
			dead = true;
			if (objectUrl) URL.revokeObjectURL(objectUrl);
		};
	}, [
		id,
		fallback,
		revision,
		local
	]);
	if (broken) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex items-center justify-center bg-paper-2 font-sans text-sm text-mute " + (className || "min-h-40"),
		children: "Kein Bild"
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
		src,
		alt,
		className,
		onError: () => setBroken(true)
	});
}
function PlacePills({ place }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-wrap gap-2",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: place.kern ? "rounded-full border border-pine/40 bg-card px-2.5 py-0.5 font-sans text-xs text-pine" : "rounded-full border border-gold/50 bg-card px-2.5 py-0.5 font-sans text-xs text-ink-soft",
				children: place.kern ? "Kern" : "Erweiterung"
			}),
			place.stand ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "rounded-full border border-line bg-card px-2.5 py-0.5 font-sans text-xs text-ink-soft",
				children: place.stand
			}) : null,
			place.status_num !== "" && place.status_num != null ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "rounded-full border border-line bg-card px-2.5 py-0.5 font-sans text-xs text-ink-soft",
				children: ["Status ", place.status_num]
			}) : null,
			place.keim ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "rounded-full border border-keim/40 bg-[#f6e6ec] px-2.5 py-0.5 font-sans text-xs text-keim",
				children: [
					"Keim ",
					place.keim,
					" still"
				]
			}) : null,
			place.typ ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "rounded-full border border-line bg-card px-2.5 py-0.5 font-sans text-xs text-ink-soft",
				children: place.typ
			}) : null
		]
	});
}
//#endregion
export { PlacePills as n, PlaceImage as t };
