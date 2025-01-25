import { Request } from "express";
import { DockviewContainer } from "./models/Container";
import { ContainerRequest } from "./models/ContainerRequest";

declare global {
	namespace Express {
		export interface Request {
			containerRequest: ContainerRequest;
			availableModes: string[];
			selectedMode: string;
		}
	}
}

declare module "express-serve-static-core" {
	export interface Request {
		subdomain: string;
		container: DockviewContainer;
	}
}

