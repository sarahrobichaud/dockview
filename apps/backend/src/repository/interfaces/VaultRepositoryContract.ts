import { ProjectDetails, ProjectQuery, ProjectVersionDetail } from "@dockview/core/shared";

export interface VaultRepositoryContract {
    getAllProjects(): ProjectDetails[];
    getProjectByName(projectName: string): ProjectDetails | null;
    getProjectByVersion(query: ProjectQuery): ProjectDetails | null;
    getProjectVersions(projectName: string): string[];

    /**
     * Checks if a project exists
     */
    hasProject(projectName: string): boolean;
    hasProjectVersion(query: ProjectQuery): boolean;
}
