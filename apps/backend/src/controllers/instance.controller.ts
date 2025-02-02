import type { NextFunction, Request, Response } from "express";
import { inject, singleton } from "tsyringe";
import type { InstanceServiceContract } from "~/services/interfaces/InstanceServiceContract";
import { TOKENS } from "~/tokens";

@singleton()
export class InstanceController {

    constructor(
        @inject(TOKENS.InstanceService) private _instanceService: InstanceServiceContract,
    ) { }

    /**
     * @description Get
     * @route GET /instances
     * @access Public
     */
    async checkHealth(req: Request, res: Response, next: NextFunction) {


        const status = await this._instanceService.getStatus(req.params.id);

        return res.success("OK", "Instance is healthy");
    }
}


