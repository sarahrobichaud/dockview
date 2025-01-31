import express, { NextFunction, Router , Request, Response } from "express";
import * as vaultController from "~/controllers/vault.controller";
import { DockviewError } from "~/errors/DockviewError";

const router: Router = express.Router();


// router.use("/:projectName/:version/live", setupPipeline('production'), requestContainer);



router.get("/:projectName/:version", (req: Request, res: Response, next: NextFunction) => {
	// Not implemented
    return next(new DockviewError("Not implemented", 501));
});

router.get("/:projectName/:version/live", vaultController.requestInstance);
router.get("/:projectName", vaultController.getProjectVersions);
router.get("/", vaultController.getAll);

export default router;