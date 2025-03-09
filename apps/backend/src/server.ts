import "reflect-metadata";

import "./init";

import { DockviewWSServer } from "@dockview/ws/server";
import cors from "cors";
import express from "express";
import morgan from "morgan";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import vhost from "vhost";
import { registerWSHandlers } from "./ws";

// Apps
import APIApp from "~/apps/api.app";
import ProxyApp from "~/apps/proxy.app";
import InstanceApp from "./apps/instance.app";
import { WSInstanceEventEmitter } from "./services/infrastructure/WSInstanceEventEmitter";
import { TOKENS } from "./tokens";
import { container } from "tsyringe";
import { InstanceManager } from "./lib/instance-manager/InstanceManager";
import { monitorEventLoopDelay } from "node:perf_hooks";

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

// Setup event emitter for instances
const instanceManager = container.resolve<InstanceManager>(TOKENS.InstanceManager);
instanceManager.eventEmitter = new WSInstanceEventEmitter(dockviewWS);


app.use(express.static("public"));

// Proxy
const host = process.env.DOMAIN || "localhost";


app.use(morgan("dev"));

// General Vault API
app.use(vhost(`api.${host}`, APIApp));
// For Docker
app.use(vhost(`backend`, APIApp));

// Proxy requests to containers
app.use(vhost(`proxy.*.${host}`, ProxyApp));

// Instance
app.use(vhost(`*.${host}`, InstanceApp));

// Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
