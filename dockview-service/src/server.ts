import express, { Request, Response } from "express";
import path from "path";
import { DockviewServer } from "dockview-ws/server";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

if (!process.env.PORT) {
  throw new Error("PORT is not defined in the environment");
}

const PORT = process.env.PORT;

const app = express();

const dockviewWS = new DockviewServer(8080);

app.use(express.static("public"));

app.set("view engine", "ejs");
app.set("views", path.resolve(__dirname, "views"));

app.get("/api/hello", (_req: Request, res: Response) => {
  res.json({ message: "Hello from dv.service.siteharbor.ca!" });
});

app.get("/test", (_req: Request, res: Response) => {
  res.render("index");
});

app.get("/about", (_req: Request, res: Response) => {
  res.render("about");
});
app.get("/page2", (_req: Request, res: Response) => {
  res.render("page2");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
