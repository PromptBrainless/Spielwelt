import { x as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as catalog, t as AppShell } from "./app-shell-DYh-f0nW.mjs";
import { t as STYLE_LOCK } from "./style-lock-DdzWPaGS.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/stil-OitbbbU8.js
var import_jsx_runtime = require_jsx_runtime();
function StilPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "font-serif text-4xl",
			children: "Bildstil · Grok"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "max-w-[62ch] text-[18px] leading-relaxed text-ink-soft",
			children: "Die grafische Sorge sitzt hier, nicht in einer 3D-Stadt. Jedes Ortsschild bleibt ein Aquarell-Druck: Bogen oben, deutscher Name, Leiste DROSSELAU, nasse Straße. Grok bekommt denselben Brief wie du — plus den Stoff des Bezirks — und ändert nur, was du am Ort anweist."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-8 grid gap-4 md:grid-cols-2",
			children: catalog.districts.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
				className: "rounded-[22px] border border-line bg-card p-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
						className: "m-0 text-xl",
						children: [
							d.num,
							" · ",
							d.name
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-ink-soft",
						children: d.intro
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 font-sans text-xs uppercase tracking-wider text-mute",
						children: "Stoff"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "m-0",
						children: d.fabric
					})
				]
			}, d.key))
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "mt-10 font-serif text-2xl",
			children: "Was Grok nicht darf"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "mt-3 max-w-[70ch] list-disc space-y-2 pl-5",
			children: catalog.laws.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: t }, t))
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "mt-10 font-serif text-2xl",
			children: "Maschinenbrief"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
			className: "mt-3 max-w-[75ch] overflow-auto whitespace-pre-wrap rounded-[22px] border border-line bg-card p-4 font-sans text-[13px] leading-relaxed text-ink-soft",
			children: STYLE_LOCK
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-6 max-w-[62ch] text-ink-soft",
			children: "Am Ort: Änderung auf Deutsch schreiben → Auftrag schärfen → Schild bearbeiten. Das Ergebnis bleibt in diesem Browser. Heftfoto setzt zurück. Ein Klick, ein Bild — kein Dauerfeuer gegen die API."
		})
	] });
}
//#endregion
export { StilPage as component };
