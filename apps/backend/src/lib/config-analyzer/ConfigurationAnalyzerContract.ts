
import { ProjectDetails} from "@dockview/core/shared";

export interface ConfigurationAnalyzerContract {
    analyze(sourcePath: string): Promise<ProjectDetails>;
    hasConfiguration(sourcePath: string): Promise<boolean>;
}

