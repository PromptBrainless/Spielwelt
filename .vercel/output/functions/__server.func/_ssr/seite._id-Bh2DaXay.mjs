import { v as Link, x as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as districtByKey, p as useCatalog, t as AppShell } from "./app-shell-DYh-f0nW.mjs";
import { n as Route } from "./router-BqzKM1KQ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/seite._id-Bh2DaXay.js
var import_jsx_runtime = require_jsx_runtime();
function SeitePage() {
	const { id } = Route.useParams();
	const extraPages = useCatalog((s) => s.extraPages);
	const upsertPage = useCatalog((s) => s.upsertPage);
	const hideSl = useCatalog((s) => s.hideSl);
	const page = extraPages.find((p) => p.id === id);
	if (!page) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Seite fehlt." }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
		to: "/eingang",
		className: "text-accent",
		children: "Zum Eingang"
	})] });
	const d = page.district ? districtByKey(page.district) : void 0;
	if (hideSl) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-ink-soft",
		children: "Diese Seite ist nur für die Spielleitung."
	}) });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "m-0 font-sans text-xs uppercase tracking-[0.14em] text-mute",
			children: "Eigene SL-Seite"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
			value: page.title,
			onChange: (e) => upsertPage({
				...page,
				title: e.target.value
			}),
			className: "mt-2 w-full border-0 bg-transparent font-serif text-4xl text-ink outline-none"
		}),
		d ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "text-mute",
			children: [
				d.num,
				" · ",
				d.name
			]
		}) : null,
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
			value: page.body,
			onChange: (e) => upsertPage({
				...page,
				body: e.target.value
			}),
			rows: 16,
			className: "mt-6 w-full rounded-[22px] border border-line bg-card px-4 py-3 font-serif text-[16px] leading-relaxed"
		})
	] });
}
//#endregion
export { SeitePage as component };
