import { Request } from "express";
import { DockviewContainer } from "../../models/Container";
import { ContainerRequest } from "../../models/ContainerRequest";
import { Request as ExpressRequest } from "express-serve-static-core";

import { Request } from "express";
import { DockviewContainer } from "./models/Container";

declare module "express-serve-static-core" {
	export interface Request {
		subdomain: string;
		container: DockviewContainer;
	}
}
declare global {
	namespace Express {
		interface Request {
			containerRequest: ContainerRequest;
			availableModes: string[];
			selectedMode: string;
			container: DockviewContainer;
			subdomain: string;
		}
	}
}