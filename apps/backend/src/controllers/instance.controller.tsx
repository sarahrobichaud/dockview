import { ContainerStatus } from "@dockview/core/enums";
import type { NextFunction, Request, Response } from "express";
import { DockviewError } from "~/errors/DockviewError.js";
import { AppContext } from "~/infrastructure/BaseRouter.js";
import type { InstanceServiceContract } from "~/services/interfaces/InstanceServiceContract.js";
import type { VaultServiceContract } from "~/services/interfaces/VaultServiceContract.js";
import { hydratable } from "~/ssr/hydration.js";
import { render } from "~/ssr/templating.js";
import { InstanceView } from "~/client/pages/Instance.js";
import { StatusView } from "~/client/pages/Status.js";
import { BaseController } from "../infrastructure/BaseController.js";
const HydratableInstanceView = hydratable(InstanceView, "instance-view");

export class InstanceController extends BaseController {

    #instanceService: InstanceServiceContract
    #vaultService: VaultServiceContract

    constructor(
        context: AppContext,
    ) {
        super(context);
        this.#instanceService = this.services.instance;
        this.#vaultService = this.services.vault;
    }

    async routeRequest(req: Request, res: Response, next: NextFunction) {

        const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
        const target = `${protocol}://proxy.${req.instance.id}.${process.env.DOMAIN}:${process.env.PORT}`;

        let template: string;
        let { name, version } = req.instance.project;

        try {
            const title = `Dockview - ${name}@${version}`;

            if (req.instance.status !== ContainerStatus.TRANSITION) {
                template = render({
                    title: title,
                    component: <StatusView data={req.instance.toPublicDTO()} />,
                    css: ["styles.css"],
                    scripts: ["dockview-client.js"]
                });
            } else {
                template = render({
                    title: title,
                    component: <HydratableInstanceView URL={target} name={`${name}@${version}`} />,
                    css: ['styles.css'],
                    scripts: ["dockview-client.js"],
                    hydrateScript: "client-entry.js",
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

    async getFiles(req: Request, res: Response, next: NextFunction) {
        const files = await this.#instanceService.getFiles(req.instance);
        console.log(files);
        return res.success(files, "Files fetched successfully");
    }

    async getFileContent(req: Request, res: Response, next: NextFunction) {

        const path = req.query.path as string;

        if (!path) {
            return next(new DockviewError("No path provided", 400));
        }

        const content = await this.#vaultService.getFileContent(path);

        if (!content) {
            return next(new DockviewError("File not found", 404));
        }

        // get file extension
        const extension = path.split(".").pop();


        const acceptedExtensions = ["txt", "astro", "vue", "json", "yaml", "js", "css", "html", "md", "yml", "toml", "xml", "csv", "ts", "tsx", "jsx", "tsx", "svg"];

        if (!extension || !acceptedExtensions.includes(extension)) {
            return next(new DockviewError("File type not supported", 415)); // Unsupported Media Type
        }

        return res.success(content, "File content fetched successfully");
    }
}

