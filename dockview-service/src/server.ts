import express, { Request, Response } from "express";
import path from "path";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();

app.use(express.static("public"));

app.set("view engine", "ejs");
app.set("views", path.resolve(__dirname, "views"));

app.get("/api/hello", (_req: Request, res: Response) => {
  res.json({ message: "Hello from the backend!" });
});
app.get("/", (_req: Request, res: Response) => {
  res.render("index");
});

app.get("/about", (_req: Request, res: Response) => {
  res.render("about");
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
