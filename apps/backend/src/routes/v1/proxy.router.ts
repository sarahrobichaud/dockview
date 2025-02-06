import express, { NextFunction, Router, Request, Response } from "express";


import { container } from "tsyringe";
import { TOKENS } from "~/tokens";
import { ProxyController } from "~/controllers/proxy.controller";

export class ProxyRouter {
    private readonly _router: Router;
    private readonly _controller: ProxyController;

    constructor() {
        this._router = express.Router();
        this._controller = container.resolve<ProxyController>(TOKENS.ProxyController);

        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        // Get all versions of a project
        this._router.get("/", this._controller.routeRequest.bind(this._controller));
        this._router.get("/instance", this._controller.proxyRequests.bind(this._controller));

        this._router.get("*", (req, res) => {
            res.status(404).send("Not found");
        });
    }

    public get router(): Router {
        return this._router;
    }
}
