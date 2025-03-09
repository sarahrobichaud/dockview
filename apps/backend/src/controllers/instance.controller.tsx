import { ContainerStatus } from "@dockview/core/enums";
import type { NextFunction, Request, Response } from "express";
import { DockviewError } from "~/errors/DockviewError";
import { AppContext } from "~/infrastructure/BaseRouter";
import type { InstanceServiceContract } from "~/services/interfaces/InstanceServiceContract";
import type { VaultServiceContract } from "~/services/interfaces/VaultServiceContract";
import { hydratable } from "~/utils/hydration";
import { render } from "~/utils/templating";
import { InstanceView } from "~/views/jsx/Instance";
import { StatusView } from "~/views/jsx/Status";
import { BaseController } from "../infrastructure/BaseController";
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
            if (req.instance.status !== ContainerStatus.TRANSITION) {
                template = render({
                    title: "Dockview",
                    component: <StatusView data={req.instance.toPublicDTO()} />,
                    css: ["styles.css"],
                    scripts: ["dockview-client.js"]
                });
            } else {
                template = render({
                    title: "Dockview",
                    component: <HydratableInstanceView URL={target} name={`${name}@${version}`} />,
                    css: ["dockview.css", 'styles.css'],
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

