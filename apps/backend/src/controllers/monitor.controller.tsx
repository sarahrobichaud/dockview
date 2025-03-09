import { NextFunction, Request, Response } from "express";
import { AppContext } from "~/infrastructure/BaseRouter";
import type { HealthServiceContract } from "~/services/interfaces/HealthServiceContract";
import { BaseController } from "../infrastructure/BaseController";

export class MonitorController extends BaseController {

    #healthService: HealthServiceContract

    constructor(
        context: AppContext,
    ) {
        super(context);
        this.#healthService = this.services.health;
    }

    /**
     * @description Get the status of an instance
     * @app health
     * @route GET /:id/status
     * @access Public
     */
    async checkHealth(req: Request, res: Response, next: NextFunction) {
        try {
            const status = await this.#healthService.getPublicStatus(req.instance.id);
            return res.success(status, "Instance is online");
        } catch (error) {
            return next(error);
        }
    }
}