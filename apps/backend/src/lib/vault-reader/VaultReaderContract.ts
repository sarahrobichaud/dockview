import { ProjectQuery } from "@dockview/core/shared";
import { FileNode } from "../filetree-builder/filetree";
import { FolderNode } from "../filetree-builder/filetree";

export interface VaultReaderContract {
    readRoot(): string[];
    readProject(projectName: string): string[];
    readProjectVersion(query: ProjectQuery): string[];

    /**
     * Paths
     */
    getProjectPath(projectName: string): string;
    getProjectVersionPath(query: ProjectQuery): string;
    getConfigPath(query: ProjectQuery, configName: string): string;

    scanProject(query: ProjectQuery): (FolderNode | FileNode)[];

    getFileContent(path: string): Promise<string | null>;

    vaultPath: string;
    versionSeparator: string;
}
