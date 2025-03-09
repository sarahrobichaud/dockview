import { NextFunction, Request, Response } from "express";
import { DockviewError } from "~/errors/DockviewError.js";

import { AppContext } from "~/infrastructure/BaseRouter.js";
import type { InstanceServiceContract } from "~/services/interfaces/InstanceServiceContract.js";
import type { VaultServiceContract } from "~/services/interfaces/VaultServiceContract.js";
import { BaseController } from "../infrastructure/BaseController.js";

export class VaultController extends BaseController {

    #vaultService: VaultServiceContract
    #instanceService: InstanceServiceContract

    constructor(
        context: AppContext,
    ) {
        super(context);
        this.#vaultService = context.container.services.vault;
        this.#instanceService = context.container.services.instance;
    }

    /**
     * @description Get all vault projects
     * @route GET /vault
     * @access Public
     */
    async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            return res.success(this.#vaultService.getProjectList(), "Vault projects fetched successfully");
        } catch (err) {
            next(err);
        }
    }

    /**
     * @description Get all versions of a project
     * @route GET /vault/:projectName
     * @access Public
     */
    async getProjectVersions(req: Request, res: Response, next: NextFunction) {
        const projectName = req.params.projectName;

        if (!projectName) {
            return next(new DockviewError("Project name is required", 400));
        }

        try {
            const versions = await this.#vaultService.getPublicProjectVersions(projectName);

            if (versions.length === 0) {
                return next(new DockviewError("Project not found", 404));
            }

            return res.success(versions, "Vault project versions details fetched successfully");
        } catch (err) {
            next(err);
        }
    }

    /**
     * @description Request an instance of a project
     * @route GET /vault/:projectName/:version/live
     */
    async requestInstance(req: Request, res: Response, next: NextFunction) {
        const { projectName, version } = req.params;
        // ... rest of implementation

        if (!projectName || !version) {
            return next(new DockviewError("Project name and version are required", 400));
        }

        try {
            const response = await this.#instanceService.request({ name: projectName, version, analysis: req.projectAnalysis });
            return res.success(response, "Instance requested successfully");
        } catch (err) {
            return next(err);
        }
    }
}



