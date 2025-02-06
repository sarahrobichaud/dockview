
import express from "express";
import cors from "cors";
import { InstanceRouter } from "~/routes/v1/instance.router";
import { responses } from "~/middlewares/response.middleware";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import { DockviewError } from "~/errors/DockviewError";

export const __dirname = path.join(dirname(fileURLToPath(import.meta.url)), "..");

export const healthApp = express();

export function createHealthApp() {
    console.log(__dirname)

    //setup view engine
    healthApp.set("view engine", "ejs");
    healthApp.set("views", path.resolve(__dirname, "..", "views"));

    healthApp.use(cors());

    healthApp.use(responses.format);

    const instance = new InstanceRouter();

    healthApp.use("/", instance.router);

    healthApp.get("/", (req, res) => {
        res.json({
            name: "Dockview Health Monitor API",
            status: "OK",
        })
    });

    healthApp.get("*", (req, res, next) => {
        next(new DockviewError("Not Found", 404));
    });

    healthApp.use(responses.handleErrors);

    return healthApp;
}

