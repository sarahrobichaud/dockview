import { ContainerStatus } from "@dockview/core/enums";
import { DockviewServerInstance } from "@dockview/core/models";
import { NextFunction, Request, Response } from "express";
import { singleton } from "tsyringe";
import httpProxy from "http-proxy";

const proxy = httpProxy.createProxyServer({
  changeOrigin: true,
  ws: false,
  selfHandleResponse: false,
});

proxy.on('error', function(err, req, res) {
  console.error('Proxy error:', err);
});

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
                instance.logs.logWarning("Container is not ready");
                return;
            }

            const { ip, port } = await container.getNetworkInfo();

            if (ip === "0.0.0.0" || port === 0) {
                instance.logs.logError("Failed to get network info");
                return;
            }


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
