import express, { Router } from "express";


import { container } from "tsyringe";
import { TOKENS } from "~/tokens";
import type { InstanceController } from "~/controllers/instance.controller";
import type { MonitorController } from "~/controllers/monitor.controller";

const router = express.Router();
const instanceController = container.resolve<InstanceController>(TOKENS.InstanceController);
const monitorController = container.resolve<MonitorController>(TOKENS.MonitorController);


router.get("/monitor", monitorController.checkHealth.bind(monitorController));
router.get("/files", instanceController.getFiles.bind(instanceController));
router.get("/", instanceController.routeRequest.bind(instanceController));
export default router;