
export interface ProjectQuery {
    name: string;
    version: string;
}

export type Project = {
    name: string;
    versions: string[];
}

export type ProjectWithDetails = {
    name: string;
    versions: ProjectVersion[];
}

export type ProjectVersion = {
    name: string;
    version: string;
    details: ProjectAnalysis;
}
export interface ProjectAnalysis {
    environment: "static" | "static-server" | "node-server";
    buildDirectory: string;
    sourceDirectory: string;
    requiredPorts: number[];
    buildRequired: boolean;
}

