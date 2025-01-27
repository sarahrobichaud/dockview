import express from "express";
import {
	getAllProjects,
	getProjectVersions,
	requestContainer,
} from "@controllers/vaultController";
import { selectProjectMode, analyzeConfiguration, analyzeProjectType, selectPipeline } from "~/middlewares/analyzer";

const router = express.Router();

const setupPipeline = (mode: string) => [
  analyzeProjectType,
  analyzeConfiguration,
  selectProjectMode(mode),
  selectPipeline,
];


router.use("/:projectName/:version/live", setupPipeline('production'), requestContainer);

router.get("/:projectName/:version", (req, res) => {
	// Not implemented
	res.status(501).send("Not implemented");
});

router.get("/:projectName", getProjectVersions);
router.get("/", getAllProjects);

export default router;
