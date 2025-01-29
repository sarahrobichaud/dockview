import { ProjectDetails, ProjectQuery } from "@dockview/core/shared";
import { ConfigurationAnalyzerContract } from "./ConfigurationAnalyzerContract";

export class ConfigurationAnalyzer implements ConfigurationAnalyzerContract {
    analyze(sourcePath: string): Promise<ProjectDetails> {
        throw new Error("Method not implemented.");
    }
    hasConfiguration(sourcePath: string): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
}