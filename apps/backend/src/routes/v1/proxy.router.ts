import express from "express";

import { container } from "tsyringe";
import { TOKENS } from "~/tokens";
import { ProxyController } from "~/controllers/proxy.controller";
import { proxyValidator } from "~/middlewares/proxy.middleware";

const router = express.Router();
const proxyController = container.resolve<ProxyController>(TOKENS.ProxyController);

router.get("*", proxyValidator, proxyController.proxyRequests.bind(proxyController));

export default router;