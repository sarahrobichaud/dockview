import { Project, ProjectQuery, ProjectVersion, ProjectWithDetails} from "@dockview/core/shared";

export interface VaultRepositoryContract {
    getAllProjects(): Project[];
    getAllProjectsWithDetails(): Promise<ProjectWithDetails[]>;

    getProjectByName(projectName: string): Project | null;
    getProjectDetails(query: ProjectQuery): Promise<ProjectVersion | null>;
    getProjectVersions(projectName: string): string[];


    /**
     * Checks if a project exists
     */
    hasProject(projectName: string): boolean;
    hasProjectVersion(query: ProjectQuery): boolean;
}
