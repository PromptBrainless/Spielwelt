import { v as Link, x as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { d as placesInDistrict, i as coverSrc, l as photoSrc, n as allPlaces, p as useCatalog, r as catalog, s as mergePlace, t as AppShell } from "./app-shell-DYh-f0nW.mjs";
import { a as Route$6 } from "./router-BqzKM1KQ.mjs";
import { n as PlacePills, t as PlaceImage } from "./pills-B2lkUWjh.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-9iunk1Wz.js
var import_jsx_runtime = require_jsx_runtime();
function Home() {
	const { q } = Route$6.useSearch();
	const patches = useCatalog((s) => s.patches);
	const customPlaces = useCatalog((s) => s.customPlaces);
	const extraPages = useCatalog((s) => s.extraPages);
	const districtPatches = useCatalog((s) => s.districtPatches);
	const hideSl = useCatalog((s) => s.hideSl);
	const query = (q || "").trim().toLowerCase();
	const hits = query ? allPlaces(customPlaces).map((p) => mergePlace(p, patches)).filter((p) => {
		return [
			p.name,
			p.kanon,
			p.sieht,
			p.wer,
			p.geruecht,
			p.sl,
			p.am_tisch,
			p.typ,
			p.bezirk
		].join(" ").toLowerCase().includes(query);
	}) : [];
	const pageHits = query ? extraPages.filter((p) => `${p.title} ${p.body}`.toLowerCase().includes(query)) : [];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "m-0 font-serif text-[42px] leading-tight tracking-tight",
				children: "Drosselau"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-2 max-w-[62ch] text-[19px] leading-relaxed text-ink-soft",
				children: [
					"Ortskatalog · ",
					catalog.count + customPlaces.length,
					" Einträge · Anno ",
					catalog.year,
					". Marktflecken im Reikland, etwa achthundert Seelen. Grok kennt den Heftstil und bearbeitet Ortsschilder, ohne Bogen und Banner zu zerlegen."
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 flex flex-wrap gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "rounded-full border border-pine/40 bg-card px-2.5 py-0.5 font-sans text-xs text-pine",
						children: "69 Kernorte"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "rounded-full border border-gold/50 bg-card px-2.5 py-0.5 font-sans text-xs text-ink-soft",
						children: "Erweiterung Fotoheft"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "rounded-full border border-line bg-card px-2.5 py-0.5 font-sans text-xs text-ink-soft",
						children: "118 Ansichten"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "rounded-full border border-keim/40 bg-[#f6e6ec] px-2.5 py-0.5 font-sans text-xs text-keim",
						children: "3 stille Keime"
					})
				]
			})
		] }),
		query ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mt-10",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
					className: "font-serif text-2xl",
					children: ["Suche: ", q]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-mute",
					children: [hits.length + pageHits.length, " Treffer"]
				}),
				pageHits.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-3 space-y-1",
					children: pageHits.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/seite/$id",
						params: { id: p.id },
						className: "text-accent hover:underline",
						children: ["SL-Seite · ", p.title]
					}) }, p.id))
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3",
					children: hits.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/ort/$id",
						params: { id: p.id },
						className: "overflow-hidden rounded-[22px] border border-line bg-card text-ink no-underline",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlaceImage, {
							id: p.id,
							fallback: photoSrc(p),
							alt: p.name,
							className: "h-40 w-full object-cover"
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
								!hideSl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 text-sm text-ink-soft",
									children: p.am_tisch
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 text-sm text-ink-soft",
									children: p.sieht
								})
							]
						})]
					}, p.id))
				})
			]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3",
			children: catalog.districts.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/bezirk/$key",
				params: { key: d.key },
				className: "overflow-hidden rounded-[22px] border border-line bg-card text-ink no-underline",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlaceImage, {
					id: d.cover,
					fallback: coverSrc(d),
					alt: d.name,
					local: false,
					className: "h-40 w-full object-cover"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "font-sans text-xs text-mute",
							children: [placesInDistrict(d.key, customPlaces).length, " Ansichten"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", {
							className: "text-lg",
							children: [
								d.num,
								" · ",
								d.name
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm text-ink-soft",
							children: districtPatches[d.key]?.intro || d.intro
						})
					]
				})]
			}, d.key))
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "mt-10 rounded-[22px] border border-line bg-card/80 p-4 text-ink-soft",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
				className: "text-ink",
				children: "Eingang für neues Material."
			}), " Texte, SL-Notizen und Bilder schickst du unter Eingang direkt in den Katalog — auf einen bestehenden Ort, einen Bezirk oder eine neue Seite. Bildaufträge an Grok ersetzen nur das lokale Schild."]
		})
	] });
}
//#endregion
export { Home as component };
