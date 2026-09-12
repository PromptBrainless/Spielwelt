import { v as Link, x as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as catalog, t as AppShell } from "./app-shell-DYh-f0nW.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/abgleich-wTLq1lIk.js
var import_jsx_runtime = require_jsx_runtime();
function AbgleichPage() {
	const kern = catalog.places.filter((p) => p.kern);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "font-serif text-4xl",
			children: "Abgleich Verzeichnis"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "max-w-[62ch] text-[18px] text-ink-soft",
			children: "Fotoheft und Kampagnenverzeichnis gelten beide. Der Kern trägt Hausnamen und Status, die Erweiterung bleibt Sichtbefund."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "mt-6 max-w-[70ch] list-disc space-y-2 pl-5",
			children: catalog.abgleich.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: t }, t))
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "mt-10 font-serif text-2xl",
			children: "Harte Setzungen"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "mt-3 max-w-[70ch] list-disc space-y-2 pl-5",
			children: catalog.laws.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: t }, t))
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "mt-10 font-serif text-2xl",
			children: "Kern — Foto zu Gasse"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "mt-3 space-y-1",
			children: kern.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/ort/$id",
				params: { id: p.id },
				className: "text-accent no-underline hover:underline",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: p.id }),
					" · ",
					p.kanon || p.name
				]
			}) }, p.id))
		})
	] });
}
//#endregion
export { AbgleichPage as component };
