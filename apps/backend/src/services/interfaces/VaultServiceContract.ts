import { ProjectDetails, ProjectQuery, ProjectVersionDetail } from "@dockview/core/shared";

export interface VaultServiceContract {
    /**
     * Retrieval of projects and versions
     */
    getProjectList(): ProjectDetails[];
    getProjectByName(projectName: string): ProjectDetails | null;
    getProjectByVersion(query: ProjectQuery): ProjectDetails | null;
    getProjectVersions(projectName: string): string[];

    /**
     * Existence checks
     */
    hasProject(projectName: string): boolean;
    hasProjectVersion(query: ProjectQuery): boolean;
}
