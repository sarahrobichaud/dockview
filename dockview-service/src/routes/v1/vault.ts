import express from "express";
import {
  getAllProjects,
  getProjectVersions,
} from "@controllers/vaultController";

const router = express.Router();

router.get("/:version", getProjectVersions);
router.get("/", getAllProjects);

export default router;
