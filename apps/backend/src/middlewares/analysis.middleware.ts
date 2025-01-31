import { NextFunction, Request, Response } from "express";
import {ProjectAnalyzer, ProjectAnalyzerFactory} from "~/lib/project-analyzer/ProjectAnalyzer";
import { VaultServiceFactory } from "~/services/VaultServiceFactory";

import { config } from "~/config";
import { ProjectQuery } from "@dockview/core/shared";
import { DockviewError } from "~/errors/DockviewError";

const projectAnalyzer = ProjectAnalyzerFactory.get();
const vaultService = VaultServiceFactory.create(config.vaultPath);

export const analyzeProject = async (req: Request, res: Response, next: NextFunction) => {

    const query: ProjectQuery = {name: req.params.projectName, version: req.params.version};

    // TODO: Consistent error handling
    if(!query.name || !query.version) {
        return next(new DockviewError("Project name and version are required", 400));
    }

    // Verify that the project version exists
    if(!vaultService.hasProjectVersion(query)) {
        return next(new DockviewError("Project version not found", 404));
    }

    // Analyze the project
    req.projectAnalysis = await projectAnalyzer.analyze(query);

    next();
}