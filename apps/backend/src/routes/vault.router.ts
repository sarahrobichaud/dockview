import { NextFunction, Request, RequestHandler, Response } from "express";
import { VaultController } from "~/controllers/vault.controller";
import { DockviewError } from "~/errors/DockviewError";
import { projectRequestPipeline } from "~/pipelines/projectRequest.pipeline";
import { Method } from "~/types/router";
import { AppContext, BaseRouter } from "../infrastructure/BaseRouter";


export class VaultRouter extends BaseRouter {

    requestInstance: RequestHandler
    getProjectVersions: RequestHandler
    getAll: RequestHandler
    requestPipeline: RequestHandler[];

    constructor(context: AppContext) {
        super({ prefix: "/v1/vault" }, context);
        const controller = new VaultController(context);

        this.requestInstance = controller.requestInstance.bind(controller);
        this.getProjectVersions = controller.getProjectVersions.bind(controller);
        this.getAll = controller.getAll.bind(controller);
        this.requestPipeline = projectRequestPipeline(context);
    }

    registerRoutes(): void {

        this.register({
            path: "/:projectName/:version/live",
            method: Method.GET,
            handler: [...this.requestPipeline, this.requestInstance]
        })

        this.register({
            path: "/:projectName/:version",
            method: Method.GET,
            handler: (req: Request, res: Response, next: NextFunction) => {
                // Not implemented
                return next(new DockviewError("Not implemented", 501));
            }
        })

        this.register({
            path: "/:projectName",
            method: Method.GET,
            handler: [this.getProjectVersions]
        })

        this.register({
            path: "/",
            method: Method.GET,
            handler: [this.getAll]
        })
    }
}
