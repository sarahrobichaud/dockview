import { NextFunction, Request, Response } from "express";
import { ProjectAnalyzer } from "~/lib/project-analyzer/ProjectAnalyzer";
import { ProjectQuery } from "@dockview/core/shared";
import { DockviewError } from "~/errors/DockviewError";
import { container } from "tsyringe";
import { VaultService } from "~/services/infrastructure/VaultService";
import { TOKENS } from "~/tokens";



export const analyzeProject = async (req: Request, res: Response, next: NextFunction) => {

    const projectAnalyzer = container.resolve<ProjectAnalyzer>(TOKENS.ProjectAnalyzer);
    const vaultService = container.resolve<VaultService>(TOKENS.VaultService);

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