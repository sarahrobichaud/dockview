
import { ProjectQuery, ProjectAnalysis } from "@dockview/core/shared";

export interface ProjectAnalyzerContract {
    analyze(query: ProjectQuery): Promise<ProjectAnalysis>;
    hasConfiguration(query: ProjectQuery): boolean;
}

