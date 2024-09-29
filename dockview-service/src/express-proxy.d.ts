import { Request } from "express";
import { DockviewContainer } from "./models/Container";

declare module "express-serve-static-core" {
	export interface Request {
		subdomain: string;
		container: DockviewContainer;
	}
}
