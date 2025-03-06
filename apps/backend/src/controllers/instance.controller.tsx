import type { NextFunction, Request, Response } from "express";
import { inject, singleton } from "tsyringe";
import type { HealthServiceContract } from "~/services/interfaces/HealthServiceContract";
import { TOKENS } from "~/tokens";
import { ContainerStatus } from "@dockview/core/enums";
import { render } from "~/utils/templating";
import { StatusView } from "~/views/jsx/Status";
import { InstanceView } from "~/views/jsx/Instance";
import { hydratable } from "~/utils/hydration";

const HydratableInstanceView = hydratable(InstanceView, "instance-view");

@singleton()
export class InstanceController {

    constructor(
        @inject(TOKENS.HealthService) private _healthService: HealthServiceContract,
    ) { }

    async routeRequest(req: Request, res: Response, next: NextFunction) {

        const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
        const target = `${protocol}://proxy.${req.instance.id}.${process.env.DOMAIN}:${process.env.PORT}`;

        let template: string;
        let { name, version } = req.instance.project;

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
                    component: <HydratableInstanceView URL={target} name={`${name}@${version}`} />,
                    css: ["styles.css"],
                    scripts: ["dockview-client.js"],
                    initialState: {
                        URL: target
                    }
                });
            }

            return res.send(template);

        } catch (err) {
            next(err);
        }
    }

}

