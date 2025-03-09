import { Method } from "~/types/router";
import { AppContext, BaseRouter } from "../infrastructure/BaseRouter";
import { ProxyController } from "~/controllers/proxy.controller";
import { RequestHandler } from "express";
import { proxyValidator } from "~/middlewares/proxy.middleware";

export class ProxyRouter extends BaseRouter {

    proxyRequests: RequestHandler

    constructor(context: AppContext) {
        super({ prefix: "/" }, context)
        const controller = new ProxyController(context)
        this.proxyRequests = controller.proxyRequests.bind(controller)

        this.useBefore(proxyValidator(context))
    }

    registerRoutes(): void {
        this.register({
            path: "*",
            method: Method.GET,
            handler: this.proxyRequests
        })
    }
}