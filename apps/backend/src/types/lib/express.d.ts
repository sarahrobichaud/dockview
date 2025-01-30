import { Request } from "express";
import { DockviewContainer } from "../../models/Container";
import { ContainerRequest } from "../../models/ContainerRequest";
import { Request as ExpressRequest } from "express-serve-static-core";

import { Request } from "express";
import { DockviewContainer } from "./models/Container";

declare global {
	namespace Express {
		interface Request {
			containerRequest: ContainerRequest;
			availableModes: string[];
			selectedMode: string;
			container: DockviewContainer;
			subdomain: string;
		}
		interface Response {
			success: (body: any, message: string) => Response;
		}
	}
}
