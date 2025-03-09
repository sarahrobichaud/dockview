import { ProjectQuery } from "@dockview/core/shared";
import { NextFunction, Request, Response } from "express";
import { DockviewError } from "~/errors/DockviewError.js";
import { AppContext } from "~/infrastructure/BaseRouter.js";


export const analyzeProject = (ctx: AppContext) => async (req: Request, res: Response, next: NextFunction) => {

    const projectAnalyzer = ctx.container.analyzers.project;
    const vaultService = ctx.container.services.vault;

    const query: ProjectQuery = { name: req.params.projectName, version: req.params.version };

    // TODO: Consistent error handling
    if (!query.name || !query.version) {
        return next(new DockviewError("Project name and version are required", 400));
    }

    // Verify that the project version exists
    if (!vaultService.hasProjectVersion(query)) {
        return next(new DockviewError("Project version not found", 404));
    }

    // Analyze the project
    try {
        req.projectAnalysis = await projectAnalyzer.analyze(query);
    } catch (error) {
        return next(new DockviewError(`Project version ${query.version} not found`, 404));
    }

    next();
}