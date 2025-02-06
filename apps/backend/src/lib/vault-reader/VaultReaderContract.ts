import { ProjectQuery } from "@dockview/core/shared";

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

    vaultPath: string;
    versionSeparator: string;
}
