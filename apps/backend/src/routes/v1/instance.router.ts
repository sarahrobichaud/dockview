import express, { Router } from "express";


import { container } from "tsyringe";
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
        this._router.get("/", this._controller.routeRequest.bind(this._controller));
    }

    public get router(): Router {
        return this._router;
    }
}
