import express, { Request, Response } from "express";
import path from "path";
import { DockviewServer } from "dockview-ws/server";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import vhost from "vhost";

import V1VaultRoutes from "@routes/v1/vault";
import { VaultReader } from "./utils/local-vault";
import morgan from "morgan";
import { projectProxyHandler } from "./proxy/projectProxy";

const __dirname = dirname(fileURLToPath(import.meta.url));

if (!process.env.PORT) {
	throw new Error("PORT is not defined in the environment");
}

export const vaultReader = new VaultReader(
	path.resolve(__dirname, "../harborvault")
);

const PORT = process.env.PORT;

type StaticContainer = {
	type: "static";
	path: string;
};

type ServerContainer = {
	type: "server";
	port: number;
	ip: string;
};

type Container = {
	lastAccessed: number;
} & (StaticContainer | ServerContainer);

export const containerMap = new Map<string, Container>();

const app = express();

const dockviewWS = new DockviewServer(8080);

app.use(morgan("dev"));

app.use(express.static("public"));

app.set("view engine", "ejs");
app.set("views", path.resolve(__dirname, "views"));

// Test routes
app.get("/api/hello", (_req, res) => {
	res.json({ message: "Hello from dv.service.siteharbor.ca!" });
});

app.get("/about", (_req, res) => {
	res.render("about");
});

app.get("/page2", (_req, res) => {
	res.render("page2");
});

app.use("/v1/vault", V1VaultRoutes);

const containerProxyHost = process.env.HOST || "localhost";

app.get("/view", (req, res) => {
	const protocol = process.env.NODE_ENV === "production" ? "https" : "http";

	const target = `${protocol}://${req.hostname}:${PORT}`;

	res.render("index", {
		data: {
			target,
		},
	});
});

app.use(
	vhost(`*.${containerProxyHost}`, (req, res, next) => {
		projectProxyHandler(req as express.Request, res as express.Response, next);
	})
);

app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`);
});
