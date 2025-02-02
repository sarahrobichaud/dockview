import type { NextFunction, Request, Response } from "express";
import { inject, singleton } from "tsyringe";
import type { HealthServiceContract } from "~/services/interfaces/HealthServiceContract";
import { TOKENS } from "~/tokens";

@singleton()
export class InstanceController {

    constructor(
        @inject(TOKENS.HealthService) private _healthService: HealthServiceContract,
    ) { }

    /**
     * @description Get the status of an instance
     * @app health
     * @route GET /:id/status
     * @access Public
     */
    async checkHealth(req: Request, res: Response, next: NextFunction) {
        try {
            const status = await this._healthService.getStatus(req.params.id);
            return res.success(status, "Instance is healthy");
        } catch (error) {
            return next(error);
        }

    }
}


