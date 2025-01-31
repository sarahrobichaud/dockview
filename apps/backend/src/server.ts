import express from "express";
import path from "path";
import { DockviewWSServer } from "@dockview/ws/server";
import { fileURLToPath } from "node:url";
import vhost from "vhost";
import { dirname } from "node:path";

import V1VaultRoutes from "@routes/v1/vault.router";
import { VaultReader } from "./utils/local-vault";
import morgan from "morgan";
import { DockviewContainer } from "./models/Container";
import { ContainerManager } from "./containers/ContainerManager";
import { registerWSHandlers } from "./ws";

import { proxyApp } from "~/proxy";
import { healthApp } from "./health";
import { errorHandler, formatResponses } from "./middlewares/wrapper";


export const __dirname = dirname(fileURLToPath(import.meta.url));

// Config
if (!process.env.PORT) {
	throw new Error("PORT is not defined in the environment");
}

export const vaultReader = new VaultReader(
	path.resolve(__dirname, "../harborvault")
);

const PORT = process.env.PORT;

const containerMap = new Map<string, DockviewContainer>();
const projectMap = new Map<string, Set<string>>();
export const containerManager = new ContainerManager(containerMap, projectMap);

const app = express();
const api = express();


export const dockviewWS = DockviewWSServer.create(8080);

registerWSHandlers();

app.use(express.static("public"));

// Template engine
api.set("view engine", "ejs");
api.set("views", path.resolve(__dirname, "views"));

proxyApp.set("view engine", "ejs");
proxyApp.set("views", path.resolve(__dirname, "views"));

api.use(formatResponses);
// Routes
api.use("/v1/vault", V1VaultRoutes);

// Proxy
const host = process.env.DOMAIN || "localhost";

app.use(morgan("dev"));

api.use("*", (req, res) => {
	res.status(404).render("not-found");
});

api.use(errorHandler);

app.use(vhost(`api.${host}`, api));
app.use(vhost(`backend`, api));
app.use(vhost(`health.${host}`, healthApp));
app.use(vhost(`*.${host}`, proxyApp));


// Server
app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`);
});
