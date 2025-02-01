import { ProjectQuery, ProjectQueryWithAnalysis } from "@dockview/core/shared";

export interface VaultWriterContract {
    writeFileToProjectVersion(query: ProjectQuery | ProjectQueryWithAnalysis, filePath: string, contents: any): void;
}
