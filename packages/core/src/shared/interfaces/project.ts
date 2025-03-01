export interface ProjectQuery {
    name: string;
    version: string;
}

export interface ProjectQueryWithAnalysis extends ProjectQuery {
    analysis: ProjectAnalysis;
}

export type Project = {
    name: string;
    versions: string[];
}

export type ProjectDetails ={
    name: string;
    versions: ProjectVersion[];
}

export type ProjectVersion = {
    name: string;
    version: string;
    details: ProjectAnalysis;
}


/**
 * Public types
 */

export type LimitedProjectDetails = {
    name: string;
    versions: LimitedProjectVersion[];
}

export type LimitedProjectVersion = {
    name: string;
    version: string;
    details: LimitedProjectAnalysis;
}


/**
 * Project analysis
 */

export type ProjectEnvironment = "static" | "static-server" | "node-server";

export type ProjectAnalysisType = "full" | "limited";

export type ProjectAnalysis = {
    type: "full"
    environment: ProjectEnvironment;
    buildDirectory: string;
    sourceDirectory: string;
    requiredPorts: number[];
    buildRequired: boolean;
    dockerfileRequired: boolean;
    dockerfileExists: boolean;
    copyFiles?: string[];
    commands: {
        build: string[];
        start: string[];
    }
}
export type LimitedProjectAnalysis = Pick<ProjectAnalysis, "environment" | "buildRequired"> & {type: "limited"};