import { ContainerStatus } from "@dockview/core/enums";
import { DockviewServerInstance } from "@dockview/core/models";
import { NextFunction, Request, Response } from "express";
import { singleton } from "tsyringe";
import httpProxy from "http-proxy";
import { ServerResponse } from "node:http";

const proxy = httpProxy.createProxyServer({
  changeOrigin: true,
  ws: false,
  selfHandleResponse: false,
  xfwd: true,
});


const staticInstances = new Map<string, boolean>();

proxy.on('error', function(err, req, res) {
  console.error('Proxy error:', err);
  if (res instanceof ServerResponse && !res.headersSent) {
    res.writeHead(502);
    res.end('Proxy Error: ' + err.message);
  }});

proxy.on('proxyReq', function(proxyReq, req, res, options) {
  const forwardedHost = req.headers['x-forwarded-host'];
  const targetUrl = options.target?.toString()

  const isStaticServer = targetUrl ? staticInstances.has(targetUrl) : false;
  console.log(staticInstances, {targetUrl, isStaticServer});

  // For nginx static servers, also set these headers
  if (isStaticServer) {
    console.log("-------------- is static server --------------");
    // Set the Host header to match the target server
    proxyReq.setHeader('host', new URL(options.target!.toString()).host);
    
    // Add custom header to help nginx identify the request
    proxyReq.setHeader('X-Dockview-Proxy', 'true');
  } else if (forwardedHost) {
    console.log("-------------- is not static server --------------");
    proxyReq.setHeader('host', forwardedHost);
  }
  
  console.log('Proxying request:', {
    originalHost: req.headers.host,
    forwardedHost: req.headers['x-forwarded-host'],
    modifiedHost: forwardedHost || req.headers.host,
    url: req.url
  });
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

            const isStaticServer = instance.project.analysis.environment === "static-server";

            if (ip === "0.0.0.0" || port === 0) {
                instance.logs.logError("Failed to get network info");
                return;
            }

            const url = `http://${ip}:${port}`;

            if (instance.project.analysis.environment === "static-server") {
              console.log("Setting static instance", url);
                staticInstances.set(url, true);
            }


            proxy.web(req, res, {
              target: url,
              changeOrigin: true,
              ws: false,
              xfwd: true,
            });
            return;
        }
    }
}
