import { LimitedProjectDetails, LimitedProjectVersion, Project, ProjectQuery, ProjectVersion, } from "@dockview/core/shared";

export interface VaultServiceContract {
    /**
     * Retrieval of projects and versions
     */
    getProjectList(): Project[];
    getDetailedProjectList(): Promise<LimitedProjectDetails[]>;

    getPublicProjectByName(projectName: string): Project | null;
    getPublicProjectByVersion(query: ProjectQuery): LimitedProjectVersion | null;
    getPublicProjectVersions(projectName: string): Promise<LimitedProjectVersion[]>;
    getPublicProjectDetails(query: ProjectQuery): Promise<LimitedProjectVersion | null>;

    /**
     * Existence checks
     */
    hasProject(projectName: string): boolean;
    hasProjectVersion(query: ProjectQuery): boolean;

    /**
     * File content retrieval
     */
    getFileContent(path: string): Promise<string | null>;
}
