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

    async routeRequest(req: Request, res: Response, next: NextFunction) {

        const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
        const target = `${protocol}://${req.hostname}:${process.env.PORT}`;

        let template: string;
        console.log(req.instance);

        try {
            if (req.instance.status !== ContainerStatus.TRANSITION) {
                template = render({
                    title: "Dockview",
                    component: <StatusView data={req.instance} />,
                    css: ["styles.css"],
                    scripts: ["dockview-client.js"]
                });
            } else {
                template = render({
                    title: "Dockview",
                    component: <InstanceView URL={target} />,
                    css: ["styles.css"],
                    scripts: ["dockview-client.js"]
                });
            }

            return res.send(template);

        }catch(err){
            next(err);
        }
    }

    async proxyRequests(req: Request, res: Response, next: NextFunction) {
         console.log("-------------- projectProxyHandler --------------");

        const subdomain = req.hostname.split(".")[0];

        // Extract projectName, version, and containerID from the subdomain
        // Assuming subdomain format: projectName--version--containerID
        const [prefix, containerID] = subdomain.split("--");

        const secFetchSite = req.headers["sec-fetch-site"];


        // Protect route
        if (secFetchSite !== "same-origin") {
            // Deny the request
            console.log("Forbidden" + req.hostname);
            res.redirect("/");
            // res.status(403).send("Forbidden");
        }

        if (prefix !== "dv") {
            res.status(400).send("Invalid subdomain.");
        }

        if (!containerID) {
            res.status(400).send("Container ID not provided.");
        }

        console.log("Container ID:", containerID);

        // Check if the containerID is valid
        const instance = req.instance;


        if (!instance) {
            return res.status(404).send("Container not found.");
        }

        if (!instance) {
            return res.status(404).send("Container not found.");
        }

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
            });
            return;
        }
    }
}
