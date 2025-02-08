import express, { NextFunction, Router, Request, Response } from "express";
import { DockviewError } from "~/errors/DockviewError";

import { projectRequestPipeline } from "~/pipelines/projectRequest.pipeline";

import { container } from "tsyringe";
import { VaultController } from "~/controllers/vault.controller";
import { TOKENS } from "~/tokens";

const router = express.Router();
const vaultController = container.resolve<VaultController>(TOKENS.VaultController);

router.get("/:projectName/:version/live", ...projectRequestPipeline, vaultController.requestInstance.bind(vaultController));

router.get("/:projectName/:version", (req: Request, res: Response, next: NextFunction) => {
    // Not implemented
    return next(new DockviewError("Not implemented", 501));
});

router.get("/:projectName", vaultController.getProjectVersions.bind(vaultController));

router.get("/", vaultController.getAll.bind(vaultController));

export default router;
