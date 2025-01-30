import { NextFunction, Request, Response } from "express";
import { nextTick } from "process";
import { DockviewError } from "~/errors/DockviewError";
import { VaultServiceFactory } from "~/services/VaultServiceFactory";

const vaultService = VaultServiceFactory.create('./harborvault');


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