import type { NextFunction, Request, Response } from "express";
import { inject, singleton } from "tsyringe";
import type { HealthServiceContract } from "~/services/interfaces/HealthServiceContract";
import { TOKENS } from "~/tokens";
import { ContainerStatus } from "@dockview/core/enums";
import { render } from "~/utils/templating";
import { StatusView } from "~/views/jsx/Status";
import { InstanceView } from "~/views/jsx/Instance";

@singleton()
export class InstanceController {

    constructor(
        @inject(TOKENS.HealthService) private _healthService: HealthServiceContract,
    ) { }

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

}

