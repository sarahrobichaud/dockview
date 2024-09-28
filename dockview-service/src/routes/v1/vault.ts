import express from "express";
import {
	getAllProjects,
	getProjectVersions,
	serveStaticAssets,
} from "@controllers/vaultController";

const router = express.Router();

router.get("/:projectName/:version/live", serveStaticAssets);

router.get("/:projectName/:version", (req, res) => {
	// Not implemented
	res.status(501).send("Not implemented");
});

router.get("/:projectName", getProjectVersions);
router.get("/", getAllProjects);

export default router;
