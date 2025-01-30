import path from "path";

import { ProjectAnalysis, ProjectQuery } from "@dockview/core/shared";
import { ProjectAnalyzerContract } from "./ProjectAnalyzerContract";
import { VaultReaderContract } from "../vault-reader/VaultReaderContract";
import { DockviewConfig } from "dockview";

export class ProjectAnalyzer implements ProjectAnalyzerContract {

    private readonly _reader: VaultReaderContract;
    private readonly _configName = "dockview.config.js";

    constructor(reader: VaultReaderContract) {
        this._reader = reader;
    }

    async analyze(query: ProjectQuery): Promise<ProjectAnalysis> {
        const hasConfig = this.hasConfiguration(query);

        if(!hasConfig) {
            throw new Error("No configuration found");
        }

        const config = await this.getConfig(query);

        const buildDirectory = this.getBuildDirectory(query, config);

        const analysis = {
            environment: config.environment,
            requiredPorts: this.getRequiredPorts(config),
            buildDirectory: buildDirectory,
            sourceDirectory: this._reader.getProjectVersionPath(query),
            buildRequired: this.isBuildRequired(query, config),
            type: "full"
        } as const;

        return analysis;
    }

    hasConfiguration(query: ProjectQuery): boolean {
        const projectContents = this._reader.readProjectVersion(query);
        const hasConfigFile = projectContents.some(p => p === this._configName);

        return hasConfigFile;
    }

    private async getConfig(query: ProjectQuery): Promise<DockviewConfig> {

        const configPath = this._reader.getConfigPath(query, this._configName);

        // Might change this to read and parse the file
        const module = await import(configPath);
        const config = (module.default || module) as DockviewConfig;

        return config;
    }

    private getRequiredPorts(config: DockviewConfig): number[] {
        switch(config.environment) {
            case "static":
            case "static-server":
                return [80, 443];
            case "node-server":
                return [...config.serve.ports, ...config.serve.wsPorts ?? []];
        }
    }

    private getBuildDirectory(query: ProjectQuery, config: DockviewConfig): string {
        const basePath = this._reader.getProjectVersionPath(query);

        switch(config.environment) {
            case "static":
            case "static-server":
                return path.join(basePath, config.staticEnv.directory);
            case "node-server":
                return path.join(basePath, config.buildDirectory);
        }
    }

    private isBuildRequired(query: ProjectQuery, config: DockviewConfig): boolean {
        const contents = this._reader.readProjectVersion(query);

        switch(config.environment) {
            case "static":
            case "static-server":
                return !contents.some(p => p === config.staticEnv.directory);
            case "node-server":
                return !contents.some(p => p === config.buildDirectory);
        }
    }
    
}