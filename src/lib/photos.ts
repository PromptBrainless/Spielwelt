const DB_NAME = "drosselau-katalog-2512";
const STORE = "images";

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => {
      if (!req.result.objectStoreNames.contains(STORE)) {
        req.result.createObjectStore(STORE);
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function putPlaceImage(id: string, blob: Blob): Promise<void> {
  const db = await openDb();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    tx.objectStore(STORE).put(blob, String(id));
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function getPlaceImageUrl(
  id: string,
  fallback: string,
): Promise<string> {
  try {
    const db = await openDb();
    const blob = await new Promise<Blob | undefined>((resolve, reject) => {
      const tx = db.transaction(STORE, "readonly");
      const rq = tx.objectStore(STORE).get(String(id));
      rq.onsuccess = () => resolve(rq.result as Blob | undefined);
      rq.onerror = () => reject(rq.error);
    });
    if (blob) return URL.createObjectURL(blob);
  } catch {
    /* canon */
  }
  return fallback;
}

export async function clearPlaceImage(id: string): Promise<void> {
  const db = await openDb();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    tx.objectStore(STORE).delete(String(id));
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function blobToDataUri(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result));
    r.onerror = () => reject(r.error);
    r.readAsDataURL(blob);
  });
}

export async function fetchAsDataUri(url: string): Promise<string> {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Bild nicht lesbar");
  const blob = await res.blob();
  return blobToDataUri(blob);
}

export function dataUriToBlob(uri: string): Blob {
  const [head, body] = uri.split(",");
  const mime = /data:([^;]+)/.exec(head)?.[1] || "image/jpeg";
  const bin = atob(body);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return new Blob([bytes], { type: mime });
}

export async function listStoredImageIds(): Promise<string[]> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, "readonly");
    const rq = tx.objectStore(STORE).getAllKeys();
    rq.onsuccess = () => resolve((rq.result as IDBValidKey[]).map(String));
    rq.onerror = () => reject(rq.error);
  });
}

export async function exportStoredImages(): Promise<Record<string, string>> {
  const ids = await listStoredImageIds();
  const out: Record<string, string> = {};
  for (const id of ids) {
    const url = await getPlaceImageUrl(id, "");
    if (!url || !url.startsWith("blob:")) continue;
    const blob = await fetch(url).then((r) => r.blob());
    URL.revokeObjectURL(url);
    out[id] = await blobToDataUri(blob);
  }
  return out;
}

export async function importStoredImages(images: Record<string, string>): Promise<number> {
  let n = 0;
  for (const [id, uri] of Object.entries(images)) {
    if (!uri.startsWith("data:image/")) continue;
    await putPlaceImage(id, dataUriToBlob(uri));
    n += 1;
  }
  return n;
}

