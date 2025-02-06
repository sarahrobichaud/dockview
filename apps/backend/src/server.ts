import "reflect-metadata";
import { DockviewWSServer } from "@dockview/ws/server";
import express from "express";
import morgan from "morgan";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import vhost from "vhost";
import { registerServices } from "./registry";
import { registerWSHandlers } from "./ws";

/**
 * Apps
 */
import { createAPIApp } from "~/apps/api.app";
import { createHealthApp } from "~/apps/health/health.app";
import { createProxyApp } from "~/apps/proxy.app";

registerServices();

export const __dirname = dirname(fileURLToPath(import.meta.url));

// Config
if (!process.env.PORT) {
    throw new Error("PORT is not defined in the environment");
}

const PORT = process.env.PORT;

const app = express();

export const dockviewWS = DockviewWSServer.create(8080);

registerWSHandlers();

app.use(express.static("public"));

// Proxy
const host = process.env.DOMAIN || "localhost";

app.use(morgan("dev"));

const apiApp = createAPIApp();
const proxyApp = createProxyApp();
const healthApp = createHealthApp();

app.use(vhost(`api.${host}`, apiApp));

// For Docker
app.use(vhost(`backend`, apiApp));

app.use(vhost(`monitor.${host}`, healthApp));
app.use(vhost(`*.${host}`, proxyApp));


// Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
