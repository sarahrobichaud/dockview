import express from "express";
import {
	getAllProjects,
	getProjectVersions,
} from "@controllers/vaultController";

import { setupContainer } from "@middlewares/containerRouter";
const router = express.Router();

router.use("/:projectName/:version/live", setupContainer);

router.get("/:projectName/:version", (req, res) => {
	// Not implemented
	res.status(501).send("Not implemented");
});

router.get("/:projectName", getProjectVersions);
router.get("/", getAllProjects);

export default router;
