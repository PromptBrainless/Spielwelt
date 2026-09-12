import { n as TSS_SERVER_FUNCTION, t as createServerFn } from "./ssr.mjs";
import { t as STYLE_LOCK } from "./style-lock-DdzWPaGS.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/server-CJCF48Lt.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var EDIT_MODEL = "grok-imagine-image-2.0";
var CHAT_MODEL = "grok-4.5";
var MAX_URI = 28e5;
function key() {
	return process.env.XAI_API_KEY;
}
var grokStatus_createServerFn_handler = createServerRpc({
	id: "d06e8dd94c358042bc248155b950062ba94130ef2884d17c612edcffb1232f96",
	name: "grokStatus",
	filename: "src/lib/grok/server.ts"
}, (opts) => grokStatus.__executeServer(opts));
var grokStatus = createServerFn({ method: "POST" }).handler(grokStatus_createServerFn_handler, async () => {
	return { available: Boolean(key()) };
});
var coachEditPrompt_createServerFn_handler = createServerRpc({
	id: "0119e7b459378f03c87fe68e59c4e025e19617e7f2fc8005fabfca41f8d9155c",
	name: "coachEditPrompt",
	filename: "src/lib/grok/server.ts"
}, (opts) => coachEditPrompt.__executeServer(opts));
var coachEditPrompt = createServerFn({ method: "POST" }).validator((input) => input).handler(coachEditPrompt_createServerFn_handler, async ({ data }) => {
	const apiKey = key();
	if (!apiKey) return {
		ok: false,
		error: "Grok ist in dieser Umgebung nicht erreichbar."
	};
	const intent = data.intent.trim().slice(0, 800);
	if (!intent) return {
		ok: false,
		error: "Schreib zuerst, was sich am Bild ändern soll."
	};
	const res = await fetch("https://api.x.ai/v1/chat/completions", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${apiKey}`
		},
		body: JSON.stringify({
			model: CHAT_MODEL,
			max_tokens: 420,
			temperature: .4,
			messages: [{
				role: "system",
				content: STYLE_LOCK + "\n\nWrite ONE English Imagine image-edit prompt (4–7 sentences). Describe only the requested change, then restate what must stay: plaque frame, German name banner, Drosselau footer, wet watercolor street, this exact building. No preamble, no quotes, no bullet lists."
			}, {
				role: "user",
				content: [
					`Place: ${data.name}`,
					`Canon: ${data.kanon}`,
					`What you see: ${data.sieht}`,
					`District material: ${data.fabric}`,
					`District mood: ${data.intro}`,
					`User wants: ${intent}`
				].join("\n")
			}]
		})
	});
	if (!res.ok) return {
		ok: false,
		error: `Grok-Antwort fehlgeschlagen (${res.status}).`
	};
	const text = (await res.json()).choices?.[0]?.message?.content?.trim() ?? "";
	if (!text) return {
		ok: false,
		error: "Leere Grok-Antwort."
	};
	return {
		ok: true,
		prompt: text
	};
});
var editPlaceImage_createServerFn_handler = createServerRpc({
	id: "c7492c6567c74cfe3cf49d6289d39be26a0ff063189f490557337f1803e7ddc9",
	name: "editPlaceImage",
	filename: "src/lib/grok/server.ts"
}, (opts) => editPlaceImage.__executeServer(opts));
var editPlaceImage = createServerFn({ method: "POST" }).validator((input) => input).handler(editPlaceImage_createServerFn_handler, async ({ data }) => {
	const apiKey = key();
	if (!apiKey) return {
		ok: false,
		error: "Grok ist in dieser Umgebung nicht erreichbar."
	};
	const prompt = data.prompt.trim().slice(0, 2500);
	if (!prompt) return {
		ok: false,
		error: "Kein Bildauftrag."
	};
	if (!data.imageDataUri.startsWith("data:image/") || data.imageDataUri.length > MAX_URI) return {
		ok: false,
		error: "Das Ausgangsbild ist zu groß oder ungültig."
	};
	if (data.styleDataUri && data.styleDataUri.length > MAX_URI) return {
		ok: false,
		error: "Das Stil-Referenzbild ist zu groß."
	};
	const payload = {
		model: EDIT_MODEL,
		prompt: `${prompt}\n\n${STYLE_LOCK}\nKeep the arched plaque, the German name banner and the DROSSELAU footer. Change only what the user asked.`
	};
	if (data.styleDataUri?.startsWith("data:image/")) payload.images = [{
		type: "image_url",
		url: data.imageDataUri
	}, {
		type: "image_url",
		url: data.styleDataUri
	}];
	else payload.image = {
		type: "image_url",
		url: data.imageDataUri
	};
	const res = await fetch("https://api.x.ai/v1/images/edits", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${apiKey}`
		},
		body: JSON.stringify(payload)
	});
	if (!res.ok) {
		const errText = await res.text().catch(() => "");
		return {
			ok: false,
			error: `Bildbearbeitung fehlgeschlagen (${res.status}). ${errText.slice(0, 180)}`
		};
	}
	const first = (await res.json()).data?.[0];
	if (first?.b64_json) return {
		ok: true,
		dataUri: `data:${first.mime_type || "image/jpeg"};base64,${first.b64_json}`
	};
	if (!first?.url) return {
		ok: false,
		error: "Kein Bild in der Antwort."
	};
	const img = await fetch(first.url);
	if (!img.ok) return {
		ok: false,
		error: "Ergebnisbild nicht ladbar."
	};
	const buf = Buffer.from(await img.arrayBuffer());
	return {
		ok: true,
		dataUri: `data:${img.headers.get("content-type") || "image/jpeg"};base64,${buf.toString("base64")}`
	};
});
var ingestUpload_createServerFn_handler = createServerRpc({
	id: "9eeb551c4573b1a55ef17ded37f00c9fd08cb9cfd428a058036a03ad77fca998",
	name: "ingestUpload",
	filename: "src/lib/grok/server.ts"
}, (opts) => ingestUpload.__executeServer(opts));
var ingestUpload = createServerFn({ method: "POST" }).validator((input) => input).handler(ingestUpload_createServerFn_handler, async ({ data }) => {
	const apiKey = key();
	if (!apiKey) return {
		ok: false,
		error: "Grok ist in dieser Umgebung nicht erreichbar."
	};
	const text = data.text.trim().slice(0, 12e3);
	if (text.length < 8) return {
		ok: false,
		error: "Der Text ist zu kurz."
	};
	const res = await fetch("https://api.x.ai/v1/chat/completions", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${apiKey}`
		},
		body: JSON.stringify({
			model: CHAT_MODEL,
			max_tokens: 900,
			temperature: .2,
			messages: [{
				role: "system",
				content: `Du sortierst Material in den Drosselau-Ortskatalog 2512. Antworte NUR mit JSON, kein Markdown.

Schema:
{"kind":"place-update"|"place-new"|"district"|"page","placeId":"","districtKey":"","name":"","title":"","body":"","patch":{"kanon":"","sieht":"","riecht":"","wer":"","geruecht":"","sl":"","am_tisch":"","typ":"","stand":""},"summary":""}

Regeln:
- place-update: bestehender Ort, placeId muss aus der Liste stammen. Nur Felder füllen, die der Text hergibt.
- place-new: neuer Ort. districtKey aus der Liste. name auf Deutsch.
- district: Bezirkstext. districtKey Pflicht. patch.intro oder patch.fabric in "body" nicht; nutze patch.kanon leer und schreib intro/fabric in patch.sieht (intro) und patch.riecht (fabric) NICHT — schreib intro in body wenn kind=district, fabric in name-Feld wenn nötig. Besser: bei kind=district steht intro in "body" und fabric in "title".
- page: freie SL-Seite. title + body (Markdown/Fließtext).
- SL-Geheimnisse nach "sl" und "geruecht". Tischsichtbares nach "am_tisch","sieht","wer".
- hint=${data.hint}. targetId=${data.targetId || ""}. targetDistrict=${data.targetDistrict || ""}.
- Harte Setzungen achten: kein Dom, Graf sitzt nicht in der Stadt, Shallya arm, Morr offenes Portal.`
			}, {
				role: "user",
				content: [
					"Bezirke: " + data.districts.map((d) => `${d.key}=${d.name}`).join("; "),
					"Orte: " + data.places.slice(0, 140).map((p) => `${p.id} ${p.name} [${p.district}]`).join(" | "),
					"Text:\n" + text
				].join("\n\n")
			}]
		})
	});
	if (!res.ok) return {
		ok: false,
		error: `Einsortieren fehlgeschlagen (${res.status}).`
	};
	const jsonText = ((await res.json()).choices?.[0]?.message?.content?.trim() ?? "").replace(/^```json\s*|\s*```$/g, "").trim();
	try {
		const parsed = JSON.parse(jsonText);
		if (!parsed?.kind) return {
			ok: false,
			error: "Grok lieferte kein gültiges Schema."
		};
		if (parsed.kind === "district") {
			parsed.body = parsed.body || parsed.patch?.sieht || "";
			parsed.title = parsed.title || parsed.patch?.riecht || parsed.patch?.kanon || "";
		}
		return {
			ok: true,
			draft: parsed
		};
	} catch {
		return {
			ok: false,
			error: "Grok-Antwort war kein JSON."
		};
	}
});
//#endregion
export { coachEditPrompt_createServerFn_handler, editPlaceImage_createServerFn_handler, grokStatus_createServerFn_handler, ingestUpload_createServerFn_handler };
