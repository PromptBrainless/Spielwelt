import { i as __toESM } from "../_runtime.mjs";
import { V as require_react, v as Link, x as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { f as slugId, n as allPlaces, o as emptyPlace, p as useCatalog, r as catalog, t as AppShell } from "./app-shell-DYh-f0nW.mjs";
import { c as putPlaceImage, i as exportStoredImages, s as importStoredImages } from "./photos-Dgn3wn7V.mjs";
import { i as ingestUpload, r as grokStatus } from "./server-C6ajGT-K.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/eingang-IWPlc2GM.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function uniqueId(base, taken) {
	let id = base || `neu-${Date.now().toString(36)}`;
	let n = 2;
	while (taken.has(id)) {
		id = `${base}-${n}`;
		n += 1;
	}
	return id;
}
function EingangPage() {
	const customPlaces = useCatalog((s) => s.customPlaces);
	const extraPages = useCatalog((s) => s.extraPages);
	const patches = useCatalog((s) => s.patches);
	const notes = useCatalog((s) => s.notes);
	const districtPatches = useCatalog((s) => s.districtPatches);
	const patchPlace = useCatalog((s) => s.patchPlace);
	const upsertCustomPlace = useCatalog((s) => s.upsertCustomPlace);
	const patchDistrict = useCatalog((s) => s.patchDistrict);
	const upsertPage = useCatalog((s) => s.upsertPage);
	const removePage = useCatalog((s) => s.removePage);
	const removeCustomPlace = useCatalog((s) => s.removeCustomPlace);
	const importPacket = useCatalog((s) => s.importPacket);
	const setNote = useCatalog((s) => s.setNote);
	const places = (0, import_react.useMemo)(() => allPlaces(customPlaces), [customPlaces]);
	const [hint, setHint] = (0, import_react.useState)("auto");
	const [targetId, setTargetId] = (0, import_react.useState)("");
	const [targetDistrict, setTargetDistrict] = (0, import_react.useState)(catalog.districts[0]?.key ?? "");
	const [text, setText] = (0, import_react.useState)("");
	const [images, setImages] = (0, import_react.useState)([]);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [msg, setMsg] = (0, import_react.useState)("");
	const [err, setErr] = (0, import_react.useState)("");
	const [drag, setDrag] = (0, import_react.useState)(false);
	const taken = (0, import_react.useMemo)(() => new Set(places.map((p) => String(p.id))), [places]);
	async function addFiles(list) {
		const next = [];
		let pasted = text;
		for (const file of Array.from(list)) if (file.type.startsWith("image/")) next.push({
			key: `${file.name}-${file.size}-${file.lastModified}`,
			preview: URL.createObjectURL(file),
			blob: file,
			fileName: file.name,
			name: file.name.replace(/\.[^.]+$/, "").replace(/[_-]+/g, " "),
			district: targetDistrict,
			attachTo: targetId
		});
		else if (file.type.startsWith("text/") || /\.(txt|md|json|csv)$/i.test(file.name)) pasted = (pasted ? pasted + "\n\n" : "") + await file.text();
		else setErr(`Datei ${file.name} wird nicht gelesen. Bilder, Text, Markdown oder JSON.`);
		if (next.length) setImages((cur) => [...cur, ...next]);
		if (pasted !== text) setText(pasted);
	}
	async function ingestText() {
		setErr("");
		setBusy(true);
		try {
			if (!(await grokStatus()).available) {
				setErr("Grok ist gerade nicht erreichbar. Du kannst Felder unten trotzdem von Hand übernehmen.");
				return;
			}
			const res = await ingestUpload({ data: {
				text,
				hint,
				targetId: targetId || void 0,
				targetDistrict: targetDistrict || void 0,
				places: places.map((p) => ({
					id: String(p.id),
					name: p.name,
					district: p.district
				})),
				districts: catalog.districts.map((d) => ({
					key: d.key,
					name: d.name
				}))
			} });
			if (!res.ok) {
				setErr(res.error);
				return;
			}
			const d = res.draft;
			if (d.kind === "place-update" && d.placeId) {
				const patch = d.patch || {};
				patchPlace(d.placeId, patch);
				if (d.body && !patch.sl) setNote(d.placeId, d.body);
				setMsg(`Ort ${d.placeId} aktualisiert. ${d.summary || ""}`);
			} else if (d.kind === "place-new") {
				const district = d.districtKey || targetDistrict;
				const id = uniqueId(slugId(d.name || "neuer-ort"), taken);
				upsertCustomPlace(emptyPlace({
					id,
					name: d.name || "Neuer Ort",
					district,
					...d.patch
				}));
				setMsg(`Neue Seite ${id} angelegt. ${d.summary || ""}`);
			} else if (d.kind === "district" && (d.districtKey || targetDistrict)) {
				const key = d.districtKey || targetDistrict;
				patchDistrict(key, {
					intro: d.body || void 0,
					fabric: d.title || void 0
				});
				setMsg(`Bezirk ${key} aktualisiert.`);
			} else if (d.kind === "page") {
				const id = uniqueId(slugId(d.title || "sl-notiz"), new Set(extraPages.map((p) => p.id)));
				upsertPage({
					id,
					title: d.title || "SL-Seite",
					body: d.body || text,
					district: d.districtKey || targetDistrict
				});
				setMsg(`Neue SL-Seite angelegt.`);
			} else setErr("Grok konnte den Text nicht zuordnen. Zielort oder Bezirk fester wählen.");
		} catch (e) {
			setErr(e instanceof Error ? e.message : "Einsortieren fehlgeschlagen.");
		} finally {
			setBusy(false);
		}
	}
	async function commitImages() {
		setErr("");
		let n = 0;
		for (const img of images) {
			if (img.attachTo) {
				await putPlaceImage(img.attachTo, img.blob);
				n += 1;
				continue;
			}
			const id = uniqueId(slugId(img.name), taken);
			taken.add(id);
			upsertCustomPlace(emptyPlace({
				id,
				name: img.name || "Neue Ansicht",
				district: img.district,
				sieht: `Neue Ansicht aus Datei ${img.fileName}.`
			}));
			await putPlaceImage(id, img.blob);
			n += 1;
		}
		images.forEach((img) => URL.revokeObjectURL(img.preview));
		setImages([]);
		setMsg(`${n} Bild${n === 1 ? "" : "er"} übernommen.`);
	}
	function saveTextByHand() {
		if (!text.trim()) {
			setErr("Kein Text.");
			return;
		}
		if (hint === "district") {
			patchDistrict(targetDistrict, { intro: text.trim() });
			setMsg("Bezirkstext übernommen.");
			return;
		}
		if (hint === "page") {
			const id = uniqueId(slugId("sl-notiz"), new Set(extraPages.map((p) => p.id)));
			upsertPage({
				id,
				title: "SL-Notiz",
				body: text.trim(),
				district: targetDistrict
			});
			setMsg("SL-Seite angelegt.");
			return;
		}
		if (targetId) {
			patchPlace(targetId, { sl: text.trim() });
			setNote(targetId, text.trim());
			setMsg(`Als SL-Text an ${targetId} gelegt.`);
			return;
		}
		const id = uniqueId(slugId("neuer-ort"), taken);
		upsertCustomPlace(emptyPlace({
			id,
			name: "Neuer Ort",
			district: targetDistrict,
			sl: text.trim()
		}));
		setMsg(`Neue Seite ${id} mit dem Text.`);
	}
	async function exportPaket() {
		const imagesOut = await exportStoredImages();
		const blob = new Blob([JSON.stringify({
			v: 1,
			patches,
			notes,
			customPlaces,
			districtPatches,
			extraPages,
			images: imagesOut
		}, null, 2)], { type: "application/json" });
		const a = document.createElement("a");
		a.href = URL.createObjectURL(blob);
		a.download = "drosselau-paket.json";
		a.click();
		setMsg("Paket gespeichert. Bilder, die du ersetzt oder neu gelegt hast, sind drin.");
	}
	async function importFile(file) {
		if (!file) return;
		setErr("");
		try {
			const packet = JSON.parse(await file.text());
			importPacket(packet);
			if (packet.images) {
				const n = await importStoredImages(packet.images);
				setMsg(`Paket geladen. ${n} Bilder wiederhergestellt.`);
			} else setMsg("Paket geladen.");
		} catch {
			setErr("Diese Datei ist kein Drosselau-Paket.");
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "font-serif text-4xl",
			children: "Eingang"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-2 max-w-[62ch] text-[18px] leading-relaxed text-ink-soft",
			children: "Hier schickst du Material direkt in den Katalog: erneuerte Bezirkstexte, SL-Notizen, Fotos auf bestehende Orte oder ganz neue Seiten. Grok liest Fließtext und legt ihn in die Felder. Alles bleibt in diesem Browser, bis du ein Paket exportierst."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
			onDragOver: (e) => {
				e.preventDefault();
				setDrag(true);
			},
			onDragLeave: () => setDrag(false),
			onDrop: (e) => {
				e.preventDefault();
				setDrag(false);
				addFiles(e.dataTransfer.files);
			},
			className: "mt-8 block cursor-pointer rounded-[22px] border-2 border-dashed px-6 py-10 text-center " + (drag ? "border-accent bg-card" : "border-line bg-card/70"),
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "font-serif text-xl",
					children: "Dateien ablegen"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-ink-soft",
					children: "Bilder werden zu Schildern. TXT, MD oder JSON landet im Textfeld. PDF bitte als Text kopieren."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "file",
					multiple: true,
					accept: "image/*,.txt,.md,.json,.csv,text/plain",
					className: "sr-only",
					onChange: (e) => {
						if (e.target.files) addFiles(e.target.files);
						e.target.value = "";
					}
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-8 grid gap-4 md:grid-cols-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "block font-sans text-xs uppercase tracking-wider text-mute",
					children: ["Das ist", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						id: "intake-hint",
						value: hint,
						onChange: (e) => setHint(e.target.value),
						className: "mt-1 w-full rounded-[14px] border border-line bg-card px-3 py-2 font-serif text-[15px] text-ink",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "auto",
								children: "Grok entscheidet"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "place",
								children: "Ortstext / SL-Info"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "district",
								children: "Bezirkstext"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "page",
								children: "Neue SL-Seite"
							})
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "block font-sans text-xs uppercase tracking-wider text-mute",
					children: ["Bestehender Ort", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						value: targetId,
						onChange: (e) => setTargetId(e.target.value),
						className: "mt-1 w-full rounded-[14px] border border-line bg-card px-3 py-2 font-serif text-[15px] text-ink",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "",
							children: "— neuer Ort oder unklar —"
						}), places.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
							value: p.id,
							children: [
								p.id,
								" · ",
								p.name
							]
						}, p.id))]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "block font-sans text-xs uppercase tracking-wider text-mute",
					children: ["Bezirk", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
						value: targetDistrict,
						onChange: (e) => setTargetDistrict(e.target.value),
						className: "mt-1 w-full rounded-[14px] border border-line bg-card px-3 py-2 font-serif text-[15px] text-ink",
						children: catalog.districts.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
							value: d.key,
							children: [
								d.num,
								" · ",
								d.name
							]
						}, d.key))
					})]
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
			className: "mt-4 block font-sans text-xs uppercase tracking-wider text-mute",
			children: ["Text", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
				id: "intake-text",
				value: text,
				onChange: (e) => setText(e.target.value),
				rows: 8,
				placeholder: "Erneuerten Gassenkanon, Gerücht, SL-Notiz oder ganzen Bezirkstext hierher.",
				className: "mt-1 w-full rounded-[22px] border border-line bg-card px-4 py-3 font-serif text-[16px] leading-relaxed"
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-3 flex flex-wrap gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				disabled: busy || !text.trim(),
				onClick: () => void ingestText(),
				className: "rounded-full border border-[#5a2410] bg-accent px-3.5 py-2 font-sans text-[13px] text-paper-2 disabled:opacity-50",
				children: busy ? "Grok liest…" : "Grok einsortieren"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				disabled: !text.trim(),
				onClick: saveTextByHand,
				className: "rounded-full border border-line-strong bg-card px-3.5 py-2 font-sans text-[13px] text-ink disabled:opacity-50",
				children: "Ohne Grok übernehmen"
			})]
		}),
		images.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mt-10",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-serif text-2xl",
					children: "Bilder in der Warteschlange"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-4 grid gap-4 sm:grid-cols-2",
					children: images.map((img, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
						className: "overflow-hidden rounded-[22px] border border-line bg-card",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: img.preview,
							alt: "",
							className: "h-40 w-full object-cover"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2 p-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									value: img.name,
									onChange: (e) => setImages((cur) => cur.map((x, j) => j === i ? {
										...x,
										name: e.target.value
									} : x)),
									className: "w-full rounded-[14px] border border-line bg-paper-2 px-3 py-2 font-serif"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
									value: img.district,
									onChange: (e) => setImages((cur) => cur.map((x, j) => j === i ? {
										...x,
										district: e.target.value
									} : x)),
									className: "w-full rounded-[14px] border border-line bg-paper-2 px-3 py-2 font-serif",
									children: catalog.districts.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
										value: d.key,
										children: [
											d.num,
											" · ",
											d.name
										]
									}, d.key))
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									value: img.attachTo,
									onChange: (e) => setImages((cur) => cur.map((x, j) => j === i ? {
										...x,
										attachTo: e.target.value
									} : x)),
									className: "w-full rounded-[14px] border border-line bg-paper-2 px-3 py-2 font-serif",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "",
										children: "Neue Seite aus diesem Bild"
									}), places.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
										value: p.id,
										children: [
											"Ersetzt ",
											p.id,
											" · ",
											p.name
										]
									}, p.id))]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => {
										URL.revokeObjectURL(img.preview);
										setImages((cur) => cur.filter((_, j) => j !== i));
									},
									className: "font-sans text-sm text-accent",
									children: "Verwerfen"
								})
							]
						})]
					}, img.key))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => void commitImages(),
					className: "mt-4 rounded-full border border-[#5a2410] bg-accent px-3.5 py-2 font-sans text-[13px] text-paper-2",
					children: "Bilder übernehmen"
				})
			]
		}) : null,
		err ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-4 text-accent",
			children: err
		}) : null,
		msg ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-4 text-pine",
			children: msg
		}) : null,
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mt-12",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-serif text-2xl",
				children: "Eigene Seiten"
			}), customPlaces.length === 0 && extraPages.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-ink-soft",
				children: "Noch keine. Ein Bild ohne Zielort oder „Neue SL-Seite“ legt welche an."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
				className: "mt-3 space-y-2",
				children: [customPlaces.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex flex-wrap items-center justify-between gap-2 border-b border-line py-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/ort/$id",
						params: { id: p.id },
						className: "text-accent no-underline hover:underline",
						children: [
							p.id,
							" · ",
							p.name
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => removeCustomPlace(p.id),
						className: "font-sans text-sm text-mute",
						children: "Entfernen"
					})]
				}, p.id)), extraPages.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex flex-wrap items-center justify-between gap-2 border-b border-line py-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/seite/$id",
						params: { id: p.id },
						className: "text-accent no-underline hover:underline",
						children: ["Seite · ", p.title]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => removePage(p.id),
						className: "font-sans text-sm text-mute",
						children: "Entfernen"
					})]
				}, p.id))]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mt-12 rounded-[22px] border border-line bg-card p-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "m-0 font-serif text-2xl",
					children: "Paket"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-ink-soft",
					children: "Texte, neue Seiten und ersetzte Bilder liegen lokal. Ein JSON-Paket nimmst du mit auf einen anderen Rechner. Kanon-Heftfotos sind schon in der App und müssen nicht mit."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 flex flex-wrap gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => void exportPaket(),
						className: "rounded-full border border-line-strong bg-paper-2 px-3.5 py-2 font-sans text-[13px]",
						children: "Paket exportieren"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "rounded-full border border-line-strong bg-paper-2 px-3.5 py-2 font-sans text-[13px]",
						children: ["Paket importieren", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "file",
							accept: "application/json,.json",
							className: "sr-only",
							onChange: (e) => void importFile(e.target.files?.[0] ?? null)
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-3 font-sans text-xs text-mute",
					children: [
						Object.keys(patches).length,
						" Textänderungen · ",
						customPlaces.length,
						" neue Orte ·",
						" ",
						extraPages.length,
						" SL-Seiten · ",
						catalog.count,
						" Kanonorte."
					]
				})
			]
		})
	] });
}
//#endregion
export { EingangPage as component };
