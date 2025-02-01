import { NextFunction, Request, Response } from "express";
import { nextTick } from "process";
import { DockviewError } from "~/errors/DockviewError";
import { InstanceService } from "~/services/infrastructure/InstanceService";
import {  inject, singleton } from "tsyringe";
import { VaultService } from "~/services/infrastructure/VaultService";

import type { InstanceServiceContract } from "~/services/interfaces/InstanceServiceContract";
import type { VaultServiceContract } from "~/services/interfaces/VaultServiceContract";
import { TOKENS } from "~/tokens";

@singleton()
export class VaultController {

    constructor(
        @inject(TOKENS.InstanceService) private _instanceService: InstanceServiceContract,
        @inject(TOKENS.VaultService) private _vaultService: VaultServiceContract
    ) {}

    /**
     * @description Get all vault projects
     * @route GET /vault
     * @access Public
     */
    async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            return res.success(this._vaultService.getProjectList(), "Vault projects fetched successfully");
        } catch(err) {
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

        if(!projectName) {
            return next(new DockviewError("Project name is required", 400));
        }

        try {
            const versions = await this._vaultService.getPublicProjectVersions(projectName);

            if(versions.length === 0) {
                return next(new DockviewError("Project not found", 404));
            }

            return res.success(await this._vaultService.getPublicProjectVersions(projectName), "Vault project versions details fetched successfully");
        } catch(err) {
            next(err);
        }
    }

    /**
     * @description Request an instance of a project
     * @route GET /vault/:projectName/:version/live
     */
    async requestInstance(req: Request, res: Response, next: NextFunction) {
        const {projectName, version} = req.params;
        // ... rest of implementation

        if(!projectName || !version){
            return next(new DockviewError("Project name and version are required", 400));
        }

        try {
            const response = await this._instanceService.request({name: projectName, version, analysis: req.projectAnalysis});
            return res.success(response, "Instance requested successfully");
        }catch(err){
            return next(err);
        }
    }
}



