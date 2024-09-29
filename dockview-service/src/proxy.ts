import httpProxy from "http-proxy";

export const proxy = httpProxy.createProxyServer({
	changeOrigin: true,
	ws: false,
	selfHandleResponse: false,
});
