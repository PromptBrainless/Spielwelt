//#region node_modules/.nitro/vite/services/ssr/assets/photos-Dgn3wn7V.js
var DB_NAME = "drosselau-katalog-2512";
var STORE = "images";
function openDb() {
	return new Promise((resolve, reject) => {
		const req = indexedDB.open(DB_NAME, 1);
		req.onupgradeneeded = () => {
			if (!req.result.objectStoreNames.contains(STORE)) req.result.createObjectStore(STORE);
		};
		req.onsuccess = () => resolve(req.result);
		req.onerror = () => reject(req.error);
	});
}
async function putPlaceImage(id, blob) {
	const db = await openDb();
	await new Promise((resolve, reject) => {
		const tx = db.transaction(STORE, "readwrite");
		tx.objectStore(STORE).put(blob, String(id));
		tx.oncomplete = () => resolve();
		tx.onerror = () => reject(tx.error);
	});
}
async function getPlaceImageUrl(id, fallback) {
	try {
		const db = await openDb();
		const blob = await new Promise((resolve, reject) => {
			const rq = db.transaction(STORE, "readonly").objectStore(STORE).get(String(id));
			rq.onsuccess = () => resolve(rq.result);
			rq.onerror = () => reject(rq.error);
		});
		if (blob) return URL.createObjectURL(blob);
	} catch {}
	return fallback;
}
async function clearPlaceImage(id) {
	const db = await openDb();
	await new Promise((resolve, reject) => {
		const tx = db.transaction(STORE, "readwrite");
		tx.objectStore(STORE).delete(String(id));
		tx.oncomplete = () => resolve();
		tx.onerror = () => reject(tx.error);
	});
}
async function blobToDataUri(blob) {
	return new Promise((resolve, reject) => {
		const r = new FileReader();
		r.onload = () => resolve(String(r.result));
		r.onerror = () => reject(r.error);
		r.readAsDataURL(blob);
	});
}
async function fetchAsDataUri(url) {
	const res = await fetch(url);
	if (!res.ok) throw new Error("Bild nicht lesbar");
	return blobToDataUri(await res.blob());
}
function dataUriToBlob(uri) {
	const [head, body] = uri.split(",");
	const mime = /data:([^;]+)/.exec(head)?.[1] || "image/jpeg";
	const bin = atob(body);
	const bytes = new Uint8Array(bin.length);
	for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
	return new Blob([bytes], { type: mime });
}
async function listStoredImageIds() {
	const db = await openDb();
	return new Promise((resolve, reject) => {
		const rq = db.transaction(STORE, "readonly").objectStore(STORE).getAllKeys();
		rq.onsuccess = () => resolve(rq.result.map(String));
		rq.onerror = () => reject(rq.error);
	});
}
async function exportStoredImages() {
	const ids = await listStoredImageIds();
	const out = {};
	for (const id of ids) {
		const url = await getPlaceImageUrl(id, "");
		if (!url || !url.startsWith("blob:")) continue;
		const blob = await fetch(url).then((r) => r.blob());
		URL.revokeObjectURL(url);
		out[id] = await blobToDataUri(blob);
	}
	return out;
}
async function importStoredImages(images) {
	let n = 0;
	for (const [id, uri] of Object.entries(images)) {
		if (!uri.startsWith("data:image/")) continue;
		await putPlaceImage(id, dataUriToBlob(uri));
		n += 1;
	}
	return n;
}
//#endregion
export { fetchAsDataUri as a, putPlaceImage as c, exportStoredImages as i, clearPlaceImage as n, getPlaceImageUrl as o, dataUriToBlob as r, importStoredImages as s, blobToDataUri as t };
