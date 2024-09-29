import { Request } from "express";

declare module "express-serve-static-core" {
	export interface Request {
		vhost?: {
			host: string;
			hostname: string;
			length: number;
			[key: string]: any; // Allows for other possible vhost properties
		};
		subdomain: string;
	}
}

declare module "vhost" {
	export interface Request extends Request {
		vhost?: {
			host: string;
			hostname: string;
			length: number;
			[key: string]: any;
		};
	}
}
