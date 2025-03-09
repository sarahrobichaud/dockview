import { RequestHandler } from "express";
import { AppContext, BaseRouter } from "../infrastructure/BaseRouter.js";
import { InstanceController } from "~/controllers/instance.controller.js";
import { MonitorController } from "~/controllers/monitor.controller.js";
import { Method } from "~/types/router.js";
import { instanceValidator } from "~/middlewares/proxy.middleware.js";

export class InstanceRouter extends BaseRouter {

    checkHealth: RequestHandler
    getFiles: RequestHandler
    getFileContent: RequestHandler
    routeRequest: RequestHandler

    constructor(context: AppContext) {

        super({ prefix: "/" }, context)

        const instanceController = new InstanceController(context)
        const monitorController = new MonitorController(context)

        this.checkHealth = monitorController.checkHealth.bind(monitorController)
        this.getFiles = instanceController.getFiles.bind(instanceController)
        this.getFileContent = instanceController.getFileContent.bind(instanceController)
        this.routeRequest = instanceController.routeRequest.bind(instanceController)

        this.useBefore(instanceValidator(context))
    }


    registerRoutes(): void {

        this.register({
            path: "/monitor",
            method: Method.GET,
            handler: this.checkHealth
        })

        this.register({
            path: "/files",
            method: Method.GET,
            handler: this.getFiles
        })

        this.register({
            path: "/file",
            method: Method.GET,
            handler: this.getFileContent
        })

        this.register({
            path: "/",
            method: Method.GET,
            handler: this.routeRequest
        })
    }

}
