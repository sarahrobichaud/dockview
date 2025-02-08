import express from "express";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import { responses } from "~/middlewares/response.middleware";
import vaultRouter from "~/routes/v1/vault.router";


export const __dirname = path.join(dirname(fileURLToPath(import.meta.url)));
export const apiApp = express();


apiApp.set("view engine", "ejs");
apiApp.set("views", path.resolve(__dirname, "..", "views"));

apiApp.use(responses.format);

apiApp.use("/v1/vault", vaultRouter);

apiApp.use("*", (req, res) => {
    res.status(404).render("not-found");
});
apiApp.use(responses.handleErrors);


export default apiApp;







