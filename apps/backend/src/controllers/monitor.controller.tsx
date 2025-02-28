import { NextFunction, Request, Response } from "express";
import { inject, singleton } from "tsyringe";
import { TOKENS } from "~/tokens";
import type { HealthServiceContract } from "~/services/interfaces/HealthServiceContract";


@singleton()
export class MonitorController {


    constructor(
        @inject(TOKENS.HealthService) private _healthService: HealthServiceContract
    ) {
    }

    /**
     * @description Get the status of an instance
     * @app health
     * @route GET /:id/status
     * @access Public
     */
    async checkHealth(req: Request, res: Response, next: NextFunction) {
        try {
            const status = await this._healthService.getPublicStatus(req.instance.id);
            return res.success(status, "Instance is online");
        } catch (error) {
            return next(error);
        }
    }
}