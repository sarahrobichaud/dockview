
import type { NextFunction, Request, Response } from "express";
import { DockviewError } from "~/errors/DockviewError.js";
import { AppContext } from "~/infrastructure/BaseRouter.js";

const instanceValidator = (ctx: AppContext) => async (req: Request, res: Response, next: NextFunction) => {
    const [prefix, containerID] = req.hostname.split(".")[0].split("--");

    const instanceManager = ctx.container.managers.instance;

    const instance = instanceManager.getByID(containerID);

    if (!instance) {
        return next(new DockviewError("Instance not found", 404));
    }

    req.instance = instance;
    next();
}

const proxyValidator = (ctx: AppContext) => async (req: Request, res: Response, next: NextFunction) => {

    // Get id from proxy.id.domain.com
    const [prefix, id] = req.hostname.split(".");

    const instanceManager = ctx.container.managers.instance;
    const instance = instanceManager.getByID(id);

    if (!instance) {
        return next(new DockviewError("Instance not found", 404));
    }

    req.instance = instance;
    next();
}

export { instanceValidator, proxyValidator };
