import "reflect-metadata";
import { DockviewWSServer } from "@dockview/ws/server";
import express from "express";
import morgan from "morgan";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import vhost from "vhost";
import { registerServices } from "./registry";
import { registerWSHandlers } from "./ws";
import cors from "cors";

/**
 * Apps
 */
import { createAPIApp } from "~/apps/api.app";
import { createMonitorApp } from "~/apps/monitor.app";
import { createProxyApp } from "~/apps/proxy.app";
import { createInstanceApp } from "./apps/instance.app";

registerServices();

export const __dirname = dirname(fileURLToPath(import.meta.url));

// Config
if (!process.env.PORT) {
    throw new Error("PORT is not defined in the environment");
}

const PORT = process.env.PORT;

const app = express();
app.use(cors({
    origin: "http://localhost:3100",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
}));

export const dockviewWS = DockviewWSServer.create(8080);

registerWSHandlers();

app.use(express.static("public"));

// Proxy
const host = process.env.DOMAIN || "localhost";

app.use(morgan("dev"));

const apiApp = createAPIApp();
const proxyApp = createProxyApp();
const healthApp = createMonitorApp();
const instanceApp = createInstanceApp();

// General Vault API
app.use(vhost(`api.${host}`, apiApp));
// For Docker
app.use(vhost(`backend`, apiApp));

// // Monitor container status
// app.use(vhost(`monitor.${host}`, healthApp));

// // Proxy requests to containers
// app.use(vhost(`proxy.${host}`, proxyApp));

// Instance
app.use(vhost(`*.${host}`, instanceApp));



// Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
