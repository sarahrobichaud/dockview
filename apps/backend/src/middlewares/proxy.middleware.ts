import { container, inject, singleton } from "tsyringe";
import { TOKENS } from "~/tokens";

import type { NextFunction, Request, Response } from "express";
import type { InstanceManagerContract } from "~/lib/instance-manager/InstanceManagerContract";
import { DockviewError } from "~/errors/DockviewError";

const instanceValidator = async (req: Request, res: Response, next: NextFunction) => {
    const [prefix, containerID] = req.hostname.split(".")[0].split("--");


    const instanceManager = container.resolve<InstanceManagerContract>(TOKENS.InstanceManager);



    const instance = instanceManager.getByID(containerID);

    if (!instance) {
        return next(new DockviewError("Instance not found", 404));
    }

    req.instance = instance;
    next();
}

const proxyValidator = async (req: Request, res: Response, next: NextFunction) => {

    // Get id from proxy.id.domain.com
    const [prefix, id] = req.hostname.split(".");

    const instanceManager = container.resolve<InstanceManagerContract>(TOKENS.InstanceManager);
    const instance = instanceManager.getByID(id);

    if (!instance) {
        return next(new DockviewError("Instance not found", 404));
    }

    req.instance = instance;
    next();
}

export { instanceValidator, proxyValidator };