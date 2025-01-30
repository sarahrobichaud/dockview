import { Project, ProjectQuery, ProjectVersion, ProjectWithDetails, } from "@dockview/core/shared";

export interface VaultServiceContract {
    /**
     * Retrieval of projects and versions
     */
    getProjectList(): Project[];
    getDetailedProjectList(): Promise<ProjectWithDetails[]>;

    getProjectByName(projectName: string): Project | null;
    getProjectByVersion(query: ProjectQuery): ProjectVersion | null;
    getProjectVersions(projectName: string): string[];
    getProjectDetails(query: ProjectQuery): Promise<ProjectVersion | null>;

    /**
     * Existence checks
     */
    hasProject(projectName: string): boolean;
    hasProjectVersion(query: ProjectQuery): boolean;
}
