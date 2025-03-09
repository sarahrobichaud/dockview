import { NextFunction, Request, RequestHandler, Response } from "express";
import { VaultController } from "~/controllers/vault.controller";
import { DockviewError } from "~/errors/DockviewError";
import { projectRequestPipeline } from "~/pipelines/projectRequest.pipeline";
import { Method } from "~/types/router";
import { AppContext, BaseRouter } from "./BaseRouter";


export class VaultRouter extends BaseRouter {

    #controller: VaultController

    requestInstance: RequestHandler
    getProjectVersions: RequestHandler
    getAll: RequestHandler

    constructor(context: AppContext) {
        super({ prefix: "/v1/vault" }, context);
        this.#controller = new VaultController(context.container.services.instance, context.container.services.vault);

        this.requestInstance = this.#controller.requestInstance.bind(this.#controller);
        this.getProjectVersions = this.#controller.getProjectVersions.bind(this.#controller);
        this.getAll = this.#controller.getAll.bind(this.#controller);
    }

    registerRoutes(): void {

        this.register({
            path: "/:projectName/:version/live",
            method: Method.GET,
            handler: [...projectRequestPipeline, this.requestInstance]
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
