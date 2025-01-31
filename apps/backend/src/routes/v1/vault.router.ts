import express, { NextFunction, Router , Request, Response } from "express";
import * as vaultController from "~/controllers/vault.controller";
import { DockviewError } from "~/errors/DockviewError";

import { projectRequestPipeline } from "~/pipelines/projectRequest.pipeline";

const router: Router = express.Router();




// Request an instance of the project
router.get("/:projectName/:version/live", ...projectRequestPipeline, vaultController.requestInstance);

// Get project's contents
router.get("/:projectName/:version", (req: Request, res: Response, next: NextFunction) => {
	// Not implemented
    return next(new DockviewError("Not implemented", 501));
});

// Get all versions of a project
router.get("/:projectName", vaultController.getProjectVersions);

// Get all projects
router.get("/", vaultController.getAll);

export default router;