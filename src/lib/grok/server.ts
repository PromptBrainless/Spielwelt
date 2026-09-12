import { createServerFn } from "@tanstack/react-start";
import { STYLE_LOCK } from "@/lib/style-lock";

const EDIT_MODEL = "grok-imagine-image-2.0";
const CHAT_MODEL = "grok-4.5";
const MAX_URI = 2_800_000;

type CoachInput = {
  intent: string;
  name: string;
  sieht: string;
  fabric: string;
  intro: string;
  kanon: string;
};

type EditInput = {
  prompt: string;
  imageDataUri: string;
  styleDataUri?: string;
};

function key() {
  return process.env.XAI_API_KEY;
}

export const grokStatus = createServerFn({ method: "POST" }).handler(async () => {
  return { available: Boolean(key()) };
});

export const coachEditPrompt = createServerFn({ method: "POST" })
  .validator((input: CoachInput) => input)
  .handler(async ({ data }) => {
    const apiKey = key();
    if (!apiKey) return { ok: false as const, error: "Grok ist in dieser Umgebung nicht erreichbar." };

    const intent = data.intent.trim().slice(0, 800);
    if (!intent) return { ok: false as const, error: "Schreib zuerst, was sich am Bild ändern soll." };

    const res = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: CHAT_MODEL,
        max_tokens: 420,
        temperature: 0.4,
        messages: [
          {
            role: "system",
            content:
              STYLE_LOCK +
              "\n\nWrite ONE English Imagine image-edit prompt (4–7 sentences). Describe only the requested change, then restate what must stay: plaque frame, German name banner, Drosselau footer, wet watercolor street, this exact building. No preamble, no quotes, no bullet lists.",
          },
          {
            role: "user",
            content: [
              `Place: ${data.name}`,
              `Canon: ${data.kanon}`,
              `What you see: ${data.sieht}`,
              `District material: ${data.fabric}`,
              `District mood: ${data.intro}`,
              `User wants: ${intent}`,
            ].join("\n"),
          },
        ],
      }),
    });
    if (!res.ok) {
      return { ok: false as const, error: `Grok-Antwort fehlgeschlagen (${res.status}).` };
    }
    const body = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const text = body.choices?.[0]?.message?.content?.trim() ?? "";
    if (!text) return { ok: false as const, error: "Leere Grok-Antwort." };
    return { ok: true as const, prompt: text };
  });

export const editPlaceImage = createServerFn({ method: "POST" })
  .validator((input: EditInput) => input)
  .handler(async ({ data }) => {
    const apiKey = key();
    if (!apiKey) return { ok: false as const, error: "Grok ist in dieser Umgebung nicht erreichbar." };

    const prompt = data.prompt.trim().slice(0, 2500);
    if (!prompt) return { ok: false as const, error: "Kein Bildauftrag." };
    if (!data.imageDataUri.startsWith("data:image/") || data.imageDataUri.length > MAX_URI) {
      return { ok: false as const, error: "Das Ausgangsbild ist zu groß oder ungültig." };
    }
    if (data.styleDataUri && data.styleDataUri.length > MAX_URI) {
      return { ok: false as const, error: "Das Stil-Referenzbild ist zu groß." };
    }

    const locked = `${prompt}\n\n${STYLE_LOCK}\nKeep the arched plaque, the German name banner and the DROSSELAU footer. Change only what the user asked.`;

    const payload: Record<string, unknown> = {
      model: EDIT_MODEL,
      prompt: locked,
    };
    if (data.styleDataUri?.startsWith("data:image/")) {
      payload.images = [
        { type: "image_url", url: data.imageDataUri },
        { type: "image_url", url: data.styleDataUri },
      ];
    } else {
      payload.image = { type: "image_url", url: data.imageDataUri };
    }

    const res = await fetch("https://api.x.ai/v1/images/edits", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      return {
        ok: false as const,
        error: `Bildbearbeitung fehlgeschlagen (${res.status}). ${errText.slice(0, 180)}`,
      };
    }
    const body = (await res.json()) as {
      data?: { url?: string; b64_json?: string; mime_type?: string }[];
    };
    const first = body.data?.[0];
    if (first?.b64_json) {
      const mime = first.mime_type || "image/jpeg";
      return { ok: true as const, dataUri: `data:${mime};base64,${first.b64_json}` };
    }
    if (!first?.url) return { ok: false as const, error: "Kein Bild in der Antwort." };

    const img = await fetch(first.url);
    if (!img.ok) return { ok: false as const, error: "Ergebnisbild nicht ladbar." };
    const buf = Buffer.from(await img.arrayBuffer());
    const mime = img.headers.get("content-type") || "image/jpeg";
    return { ok: true as const, dataUri: `data:${mime};base64,${buf.toString("base64")}` };
  });

type IngestInput = {
  text: string;
  hint: "auto" | "place" | "district" | "page";
  targetId?: string;
  targetDistrict?: string;
  places: { id: string; name: string; district: string }[];
  districts: { key: string; name: string }[];
};

export type IngestDraft = {
  kind: "place-update" | "place-new" | "district" | "page";
  placeId?: string;
  districtKey?: string;
  name?: string;
  title?: string;
  body?: string;
  patch?: Record<string, string>;
  summary?: string;
};

export const ingestUpload = createServerFn({ method: "POST" })
  .validator((input: IngestInput) => input)
  .handler(async ({ data }): Promise<{ ok: true; draft: IngestDraft } | { ok: false; error: string }> => {
    const apiKey = key();
    if (!apiKey) return { ok: false, error: "Grok ist in dieser Umgebung nicht erreichbar." };

    const text = data.text.trim().slice(0, 12000);
    if (text.length < 8) return { ok: false, error: "Der Text ist zu kurz." };

    const res = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: CHAT_MODEL,
        max_tokens: 900,
        temperature: 0.2,
        messages: [
          {
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
- Harte Setzungen achten: kein Dom, Graf sitzt nicht in der Stadt, Shallya arm, Morr offenes Portal.`,
          },
          {
            role: "user",
            content: [
              "Bezirke: " + data.districts.map((d) => `${d.key}=${d.name}`).join("; "),
              "Orte: " +
                data.places
                  .slice(0, 140)
                  .map((p) => `${p.id} ${p.name} [${p.district}]`)
                  .join(" | "),
              "Text:\n" + text,
            ].join("\n\n"),
          },
        ],
      }),
    });
    if (!res.ok) return { ok: false, error: `Einsortieren fehlgeschlagen (${res.status}).` };
    const body = (await res.json()) as { choices?: { message?: { content?: string } }[] };
    const raw = body.choices?.[0]?.message?.content?.trim() ?? "";
    const jsonText = raw.replace(/^```json\s*|\s*```$/g, "").trim();
    try {
      const parsed = JSON.parse(jsonText) as IngestDraft;
      if (!parsed?.kind) return { ok: false, error: "Grok lieferte kein gültiges Schema." };
      if (parsed.kind === "district") {
        parsed.body = parsed.body || parsed.patch?.sieht || "";
        parsed.title = parsed.title || parsed.patch?.riecht || parsed.patch?.kanon || "";
      }
      return { ok: true, draft: parsed };
    } catch {
      return { ok: false, error: "Grok-Antwort war kein JSON." };
    }
  });

