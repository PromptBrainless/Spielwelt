import { n as TSS_SERVER_FUNCTION, r as getServerFnById, t as createServerFn } from "./ssr.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/server-C6ajGT-K.js
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var grokStatus = createServerFn({ method: "POST" }).handler(createSsrRpc("d06e8dd94c358042bc248155b950062ba94130ef2884d17c612edcffb1232f96"));
var coachEditPrompt = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("0119e7b459378f03c87fe68e59c4e025e19617e7f2fc8005fabfca41f8d9155c"));
var editPlaceImage = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("c7492c6567c74cfe3cf49d6289d39be26a0ff063189f490557337f1803e7ddc9"));
var ingestUpload = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("9eeb551c4573b1a55ef17ded37f00c9fd08cb9cfd428a058036a03ad77fca998"));
//#endregion
export { ingestUpload as i, editPlaceImage as n, grokStatus as r, coachEditPrompt as t };
