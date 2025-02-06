import express from "express";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import { VaultController } from "~/controllers/vault.controller";
import { responses } from "~/middlewares/response.middleware";
import { InstanceRouter } from "~/routes/v1/instance.router";
import { VaultRouter } from "~/routes/v1/vault.router";


export const __dirname = path.join(dirname(fileURLToPath(import.meta.url)), "..");
export const apiApp = express();




export function createAPIApp() {
    apiApp.set("view engine", "ejs");
    apiApp.set("views", path.resolve(__dirname, "views"));

    apiApp.use(responses.format);

    const { router } = new VaultRouter();

    apiApp.use("/v1/vault", router);

    apiApp.use("*", (req, res) => {
        res.status(404).render("not-found");
    });
    apiApp.use(responses.handleErrors);

    return apiApp;
}








