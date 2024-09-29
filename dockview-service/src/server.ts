import express from "express";
import path from "path";
import { DockviewServer } from "dockview-ws/server";
import { fileURLToPath } from "node:url";
import vhost from "vhost";
import { dirname } from "node:path";

import V1VaultRoutes from "@routes/v1/vault";
import { VaultReader } from "./utils/local-vault";
import morgan from "morgan";
import { proxyApp } from "~/proxy";
import { DockviewContainer } from "./models/Container";
import { ContainerManager } from "./containers/ContainerManager";

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

const dockviewWS = new DockviewServer(8080);

app.use(morgan("dev"));

app.use(express.static("public"));

// Template engine
app.set("view engine", "ejs");
app.set("views", path.resolve(__dirname, "views"));

proxyApp.set("view engine", "ejs");
proxyApp.set("views", path.resolve(__dirname, "views"));

// Routes
app.use("/v1/vault", V1VaultRoutes);

// Proxy
const containerProxyHost = process.env.HOST || "localhost";
app.use(vhost(`*.${containerProxyHost}`, proxyApp));

// Server
app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`);
});
