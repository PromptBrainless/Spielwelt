import { i as __toESM } from "../_runtime.mjs";
import { V as require_react, v as Link, x as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as districtByKey, c as neighborPlaces, i as coverSrc, l as photoSrc, p as useCatalog, s as mergePlace, t as AppShell, u as placeById } from "./app-shell-DYh-f0nW.mjs";
import { r as Route$1 } from "./router-BqzKM1KQ.mjs";
import { a as fetchAsDataUri, c as putPlaceImage, n as clearPlaceImage, o as getPlaceImageUrl, r as dataUriToBlob, t as blobToDataUri } from "./photos-Dgn3wn7V.mjs";
import { n as PlacePills, t as PlaceImage } from "./pills-B2lkUWjh.mjs";
import { n as editPlaceImage, r as grokStatus, t as coachEditPrompt } from "./server-C6ajGT-K.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ort._id-C7AeoLCg.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function GrokStudio({ place, district, onImageChange }) {
	const [available, setAvailable] = (0, import_react.useState)(null);
	const [intent, setIntent] = (0, import_react.useState)("");
	const [prompt, setPrompt] = (0, import_react.useState)("");
	const [holdStyle, setHoldStyle] = (0, import_react.useState)(true);
	const [busy, setBusy] = (0, import_react.useState)(null);
	const [error, setError] = (0, import_react.useState)("");
	const [note, setNote] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		grokStatus().then((s) => setAvailable(s.available));
	}, []);
	async function currentDataUri() {
		const fallback = photoSrc(place);
		const url = await getPlaceImageUrl(place.id, fallback);
		if (url.startsWith("blob:")) {
			const blob = await fetch(url).then((r) => r.blob());
			return blobToDataUri(blob);
		}
		return fetchAsDataUri(url);
	}
	async function sharpen() {
		setError("");
		setBusy("coach");
		try {
			const res = await coachEditPrompt({ data: {
				intent,
				name: place.name,
				sieht: place.sieht,
				kanon: place.kanon,
				fabric: district?.fabric ?? "",
				intro: district?.intro ?? ""
			} });
			if (!res.ok) {
				setError(res.error);
				return;
			}
			setPrompt(res.prompt);
			setNote("Auftrag geschärft. Prüfen, dann Bild bearbeiten.");
		} catch (e) {
			setError(e instanceof Error ? e.message : "Coach fehlgeschlagen.");
		} finally {
			setBusy(null);
		}
	}
	async function runEdit() {
		const job = (prompt || intent).trim();
		if (!job) {
			setError("Schreib, was Grok am Ortsschild ändern soll.");
			return;
		}
		setError("");
		setBusy("edit");
		try {
			const imageDataUri = await currentDataUri();
			let styleDataUri;
			if (holdStyle && district) styleDataUri = await fetchAsDataUri(coverSrc(district));
			const res = await editPlaceImage({ data: {
				prompt: job,
				imageDataUri,
				styleDataUri
			} });
			if (!res.ok) {
				setError(res.error);
				return;
			}
			await putPlaceImage(place.id, dataUriToBlob(res.dataUri));
			setNote("Neues Schild liegt lokal in diesem Browser. Kanon stellt das Heftfoto wieder her.");
			onImageChange();
		} catch (e) {
			setError(e instanceof Error ? e.message : "Bearbeitung fehlgeschlagen.");
		} finally {
			setBusy(null);
		}
	}
	async function revert() {
		await clearPlaceImage(place.id);
		setNote("Heftfoto wieder aktiv.");
		onImageChange();
	}
	async function onFile(file) {
		if (!file) return;
		await putPlaceImage(place.id, file);
		setNote("Eigenes Foto gespeichert.");
		onImageChange();
	}
	if (available === false) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "rounded-[22px] border border-line bg-card p-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "m-0 font-serif text-xl",
				children: "Grok Bildwerkstatt"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-ink-soft",
				children: "Die Imagine-API ist hier gerade nicht erreichbar. Du kannst trotzdem ein eigenes Foto legen."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "mt-3 block font-sans text-sm text-mute",
				children: ["Eigenes Foto", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "file",
					accept: "image/*",
					className: "mt-1 block w-full",
					onChange: (e) => void onFile(e.target.files?.[0] ?? null)
				})]
			})
		]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "rounded-[22px] border border-line bg-card p-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "m-0 font-serif text-xl",
				children: "Grok Bildwerkstatt"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-[15px] leading-relaxed text-ink-soft",
				children: "Grok sieht das aktuelle Ortsschild und den Stoff dieses Bezirks. Sag auf Deutsch, was falsch ist — nasser als das Heft, weniger Marmor, Ranald-X an der Tür. Grok schreibt den englischen Imagine-Auftrag und hält Bogen, Namensbanner und die Leiste DROSSELAU."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "mt-4 block font-sans text-xs uppercase tracking-wider text-mute",
				children: ["Änderung", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
					value: intent,
					onChange: (e) => setIntent(e.target.value),
					rows: 3,
					placeholder: "z. B. Der Matschweg tiefer, kein weißes Hospiz im Hintergrund, Rauch dünner.",
					className: "mt-1 w-full rounded-[14px] border border-line bg-paper-2 px-3 py-2 font-serif text-[15px] text-ink"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "mt-3 flex items-start gap-2 font-sans text-sm text-ink-soft",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "checkbox",
					className: "mt-1",
					checked: holdStyle,
					onChange: (e) => setHoldStyle(e.target.checked)
				}), "Stil an das Bezirksfoto koppeln (zweites Referenzbild)"]
			}),
			prompt ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "mt-3 block font-sans text-xs uppercase tracking-wider text-mute",
				children: ["Imagine-Auftrag", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
					value: prompt,
					onChange: (e) => setPrompt(e.target.value),
					rows: 5,
					className: "mt-1 w-full rounded-[14px] border border-line bg-paper-2 px-3 py-2 font-serif text-[15px] text-ink"
				})]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 flex flex-wrap gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						disabled: busy !== null,
						onClick: () => void sharpen(),
						className: "rounded-full border border-line-strong bg-paper-2 px-3.5 py-2 font-sans text-[13px] text-ink disabled:opacity-50",
						children: busy === "coach" ? "Grok schreibt…" : "Auftrag schärfen"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						disabled: busy !== null,
						onClick: () => void runEdit(),
						className: "rounded-full border border-[#5a2410] bg-accent px-3.5 py-2 font-sans text-[13px] text-paper-2 disabled:opacity-50",
						children: busy === "edit" ? "Schild wird gezeichnet…" : "Schild bearbeiten"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						disabled: busy !== null,
						onClick: () => void revert(),
						className: "rounded-full border border-line-strong bg-transparent px-3.5 py-2 font-sans text-[13px] text-ink disabled:opacity-50",
						children: "Heftfoto"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "mt-3 block font-sans text-xs uppercase tracking-wider text-mute",
				children: ["Oder eigenes Foto", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "file",
					accept: "image/*",
					className: "mt-1 block w-full text-sm",
					onChange: (e) => void onFile(e.target.files?.[0] ?? null)
				})]
			}),
			error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-sm text-accent",
				children: error
			}) : null,
			note ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-pine",
				children: note
			}) : null
		]
	});
}
var FIELDS = [
	{
		key: "name",
		label: "Name"
	},
	{
		key: "typ",
		label: "Typ"
	},
	{
		key: "stand",
		label: "Stand"
	},
	{
		key: "kanon",
		label: "Kanon"
	},
	{
		key: "sieht",
		label: "Man sieht"
	},
	{
		key: "riecht",
		label: "Man riecht"
	},
	{
		key: "wer",
		label: "Wer hier ist"
	},
	{
		key: "geruecht",
		label: "Gerücht",
		sl: true
	},
	{
		key: "sl",
		label: "Für die Spielleitung",
		sl: true
	},
	{
		key: "am_tisch",
		label: "Am Tisch"
	}
];
function OrtPage() {
	const { id } = Route$1.useParams();
	const customPlaces = useCatalog((s) => s.customPlaces);
	const raw = placeById(id, customPlaces);
	const patches = useCatalog((s) => s.patches);
	const hideSl = useCatalog((s) => s.hideSl);
	const notes = useCatalog((s) => s.notes);
	const setNote = useCatalog((s) => s.setNote);
	const patchPlace = useCatalog((s) => s.patchPlace);
	const [editing, setEditing] = (0, import_react.useState)(false);
	const [rev, setRev] = (0, import_react.useState)(0);
	if (!raw) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
		"Ort ",
		id,
		" fehlt."
	] }) });
	const place = mergePlace(raw, patches);
	const d = districtByKey(place.district);
	const { prev, next } = neighborPlaces(place.id, customPlaces);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-4 flex flex-wrap gap-2",
			children: [
				d ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/bezirk/$key",
					params: { key: d.key },
					className: "rounded-full border border-line-strong bg-card px-3 py-1.5 font-sans text-[13px] text-ink no-underline",
					children: ["← ", d.short]
				}) : null,
				prev ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/ort/$id",
					params: { id: prev.id },
					className: "rounded-full border border-line-strong bg-card px-3 py-1.5 font-sans text-[13px] text-ink no-underline",
					children: ["◀ ", prev.id]
				}) : null,
				next ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/ort/$id",
					params: { id: next.id },
					className: "rounded-full border border-line-strong bg-card px-3 py-1.5 font-sans text-[13px] text-ink no-underline",
					children: [next.id, " ▶"]
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setEditing((v) => !v),
					className: "rounded-full border px-3 py-1.5 font-sans text-[13px] " + (editing ? "border-[#5a2410] bg-accent text-paper-2" : "border-line-strong bg-card text-ink"),
					children: editing ? "Ansicht" : "Bearbeiten"
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid grid-cols-1 gap-6 lg:grid-cols-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "overflow-hidden rounded-[22px] border border-line bg-card",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlaceImage, {
					id: place.id,
					fallback: photoSrc(place),
					alt: place.name,
					revision: rev,
					className: "aspect-[4/5] w-full object-cover"
				})
			}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlacePills, { place }),
				FIELDS.map((f) => {
					if (hideSl && f.sl && !editing) return null;
					const value = String(place[f.key] ?? "");
					if (!editing && !value) return null;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-sans text-xs uppercase tracking-wider text-mute",
							children: f.label
						}), editing ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							value,
							onChange: (e) => patchPlace(place.id, { [f.key]: e.target.value }),
							rows: f.key === "name" || f.key === "typ" || f.key === "stand" ? 1 : 3,
							className: "mt-1 w-full rounded-[14px] border border-line bg-card px-3 py-2 font-serif text-[15px]"
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 whitespace-pre-wrap leading-relaxed",
							children: value
						})]
					}, f.key);
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "font-sans text-xs uppercase tracking-wider text-mute",
						children: "Eigene SL-Notiz"
					}), editing ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
						value: notes[place.id] || "",
						onChange: (e) => setNote(place.id, e.target.value),
						rows: 3,
						className: "mt-1 w-full rounded-[14px] border border-line bg-card px-3 py-2 font-serif text-[15px]"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-ink-soft",
						children: notes[place.id] || "—"
					})]
				})
			] })]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-8",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GrokStudio, {
				place,
				district: d,
				onImageChange: () => setRev((n) => n + 1)
			})
		})
	] });
}
//#endregion
export { OrtPage as component };
