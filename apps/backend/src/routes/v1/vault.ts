import express, { Router } from "express";
import {
	getAllProjects,
	getProjectVersions,
	requestContainer,
} from "@controllers/vaultController";
import { selectProjectMode, analyzeConfiguration, analyzeProjectType, selectPipeline } from "~/middlewares/analyzer";

const router: Router = express.Router();

const setupPipeline = (mode: string) => [
  analyzeProjectType,
  analyzeConfiguration,
  selectProjectMode(mode),
  selectPipeline,
];

import * as vaultController from "~/controllers/vault.controller";


router.use("/:projectName/:version/live", setupPipeline('production'), requestContainer);

router.get("/:projectName/:version", (req, res) => {
	// Not implemented
	res.status(501).send("Not implemented");
});

router.get("/:projectName", vaultController.getProjectVersions);
router.get("/", vaultController.getAll);

export default router;
