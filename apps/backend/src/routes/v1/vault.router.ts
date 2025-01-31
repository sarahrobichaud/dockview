import express, { NextFunction, Router , Request, Response } from "express";
import * as vaultController from "~/controllers/vault.controller";
import { DockviewError } from "~/errors/DockviewError";

import { projectRequestPipeline } from "~/pipelines/projectRequest.pipeline";


import { container} from "tsyringe";
import { VaultController } from "~/controllers/vault.controller";
import { TOKENS } from "~/tokens";

export class VaultRouter {
    private readonly _router: Router;
    private readonly _controller: VaultController;

    constructor() {
        this._router = express.Router();
        this._controller = container.resolve<VaultController>(TOKENS.VaultController);
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        // Request an instance of the project
        this._router.get("/:projectName/:version/live", ...projectRequestPipeline, this._controller.requestInstance.bind(this._controller));

        // Get project's contents 
        this._router.get("/:projectName/:version", (req: Request, res: Response, next: NextFunction) => {
            // Not implemented
            return next(new DockviewError("Not implemented", 501));
        });

        // Get all versions of a project
        this._router.get("/:projectName", this._controller.getProjectVersions.bind(this._controller));

        // Get all projects
        this._router.get("/", this._controller.getAll.bind(this._controller));
    }

    public get router(): Router {
        return this._router;
    }
}
