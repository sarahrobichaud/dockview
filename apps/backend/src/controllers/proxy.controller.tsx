import { ContainerStatus } from "@dockview/core/enums";
import { DockviewServerInstance } from "@dockview/core/models";
import { NextFunction, Request, Response } from "express";
import { singleton } from "tsyringe";
import { proxy } from "~/proxy/projectProxy";
import { TOKENS } from "~/tokens";
import { render } from "~/utils/templating";
import { InstanceView } from "~/views/jsx/Instance";
import { StatusView } from "~/views/jsx/Status";


@singleton()
export class ProxyController {

    constructor() {
    }

    async proxyRequests(req: Request, res: Response, next: NextFunction) {
         console.log("-------------- projectProxyHandler --------------");

        // Check if the containerID is valid
        const instance = req.instance;

        instance.updateLastAccessed();

        if (instance instanceof DockviewServerInstance && instance.container) {

            const container = instance.container;
            // Not implemented yet
            console.log("-------------- is server --------------");

            if (instance.status !== ContainerStatus.TRANSITION) {
            res.render("launching");
            return;
            }
            const { ip, port } = await container.getNetworkInfo();

            proxy.web(req, res, {
            target: `http://${ip}:${port}`,
            changeOrigin: true,
            ws: false,
            xfwd: true,
            });
            return;
        }
    }
}
