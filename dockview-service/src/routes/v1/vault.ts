import express from "express";
import { vaultReader } from "~/server";
import { VaultReaderError } from "~/utils/local-vault";
import { getAllProjects } from "@controllers/vaultController";

const router = express.Router();

router.get("/", getAllProjects);

export default router;
