import express from "express";
import {
	getAllProjects,
	getProjectVersions,
	requestContainer,
} from "@controllers/vaultController";

const router = express.Router();

router.use("/:projectName/:version/live", requestContainer);

router.get("/:projectName/:version", (req, res) => {
	// Not implemented
	res.status(501).send("Not implemented");
});

router.get("/:projectName", getProjectVersions);
router.get("/", getAllProjects);

export default router;
