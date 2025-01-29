import { ProjectQuery } from "@dockview/core/shared";

export interface VaultReaderContract {
    readRoot(): string[];
    readProject(projectName: string): string[];
    readProjectVersion(query: ProjectQuery): string[];
    vaultPath: string;
    versionSeparator: string;
}
