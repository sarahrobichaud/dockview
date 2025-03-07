import { LimitedProjectDetails, LimitedProjectVersion, Project, ProjectQuery, ProjectVersion } from "@dockview/core/shared";
import { FileNode } from "~/lib/filetree-builder/filetree";
import { FolderNode } from "~/lib/filetree-builder/filetree";

export interface VaultRepositoryContract {
    getAllProjects(): Project[];
    getAllProjectsWithDetails(): Promise<LimitedProjectDetails[]>;

    getProjectByName(projectName: string): Project | null;
    getProjectDetails(query: ProjectQuery): Promise<LimitedProjectVersion | null>;
    getProjectVersions(projectName: string): Promise<LimitedProjectVersion[]>;

    /**
     * Checks if a project exists
     */
    hasProject(projectName: string): boolean;
    hasProjectVersion(query: ProjectQuery): boolean;

    scanProject(query: ProjectQuery): (FolderNode | FileNode)[];
}
