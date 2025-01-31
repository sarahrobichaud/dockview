import { NextFunction, Request, Response } from "express";
import { nextTick } from "process";
import { DockviewError } from "~/errors/DockviewError";
import { InstanceService } from "~/services/infrastructure/InstanceService";
import { VaultServiceFactory } from "~/services/VaultServiceFactory";

const vaultService = VaultServiceFactory.create('./harborvault');
const instanceService = new InstanceService();


/**
 * @description Get all vault projects
 * @route GET /vault
 * @access Public
 */
export const getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
        return res.success(vaultService.getProjectList(), "Vault projects fetched successfully");
    }catch(err){
        next(err);
    }
}



/**
* @description Get all versions of a project
* @route GET /vault/:projectName
* @access Public
*/ 
export const getProjectVersions = async (req: Request, res: Response, next: NextFunction) => {
    const projectName = req.params.projectName;

    if(!projectName){
        return next(new DockviewError("Project name is required", 400));
    }

    try {
        const versions = await vaultService.getPublicProjectVersions(projectName);

        if(versions.length === 0){
            return next(new DockviewError("Project not found", 404));
        }

        return res.success(await vaultService.getPublicProjectVersions(projectName), "Vault project versions details fetched successfully");
    }catch(err){
        next(err);
    }
}

/**
 * @description Request an instance of a project
 * @route GET /vault/:projectName/:version/live
 */

export const requestInstance = async (req: Request, res: Response, next: NextFunction) => {
    const {projectName, version} = req.params;

    if(!projectName || !version){
        return next(new DockviewError("Project name and version are required", 400));
    }

    const response = await instanceService.request({name: projectName, version});

    return res.success(response, "Instance requested successfully");
}