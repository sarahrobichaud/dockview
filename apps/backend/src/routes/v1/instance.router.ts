import express, { NextFunction, Router, Request, Response } from "express";
import { DockviewError } from "~/errors/DockviewError";

import { projectRequestPipeline } from "~/pipelines/projectRequest.pipeline";

import { container } from "tsyringe";
import { VaultController } from "~/controllers/vault.controller";
import { TOKENS } from "~/tokens";
import { InstanceController } from "~/controllers/instance.controller";

export class InstanceRouter {
    private readonly _router: Router;
    private readonly _controller: InstanceController;

    constructor() {
        this._router = express.Router();
        this._controller = container.resolve<InstanceController>(TOKENS.InstanceController);
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        // Get all versions of a project
        this._router.get("/:id/status", this._controller.checkHealth.bind(this._controller));
    }

    public get router(): Router {
        return this._router;
    }
}
