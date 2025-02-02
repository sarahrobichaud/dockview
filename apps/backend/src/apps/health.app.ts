
import express from "express";
import cors from "cors";
import { InstanceRouter } from "~/routes/v1/instance.router";
import { responses } from "~/middlewares/response.middleware";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

export const __dirname = dirname(fileURLToPath(import.meta.url));

export const healthApp = express();

export function createHealthApp() {

    //setup view engine
    healthApp.set("view engine", "ejs");
    healthApp.set("views", path.resolve(__dirname, "..", "views"));

    healthApp.use(cors());
    healthApp.use(responses.format);

    const { router } = new InstanceRouter();

    healthApp.use("/", router);

    healthApp.get("/", (req, res) => {
        res.json({
            name: "Dockview Health Monitor API",
            status: "OK",
        })
    });

    healthApp.use(responses.handleErrors);

    return healthApp;
}

