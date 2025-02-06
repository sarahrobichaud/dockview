import { ContainerStatus } from "@dockview/core/enums";
import { NextFunction, Request, Response } from "express";
import { singleton } from "tsyringe";
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
                    component: <InstanceView />,
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
        return res.send("Hello World");
    }
}
