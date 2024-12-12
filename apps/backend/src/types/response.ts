import { RequestHandler } from "express";
import { V1Response } from "@dockview/core/api/types/responses"

export type TypedRequestHandler<T extends {}> = RequestHandler<
	any,
	V1Response<T>,
	any,
	any
>;
