import path from "path";

import { ProjectAnalysis, ProjectQuery } from "@dockview/core/shared";
import { ProjectAnalyzerContract } from "./ProjectAnalyzerContract";
import type { VaultReaderContract } from "../vault-reader/VaultReaderContract";
import { DockviewConfig } from "dockview";

export class ProjectAnalyzer implements ProjectAnalyzerContract {

    private readonly _configName = "dockview.config.js";
    private readonly _dockerfileName = "Dockerfile.dockview.yaml";

    constructor(
        private _reader: VaultReaderContract
    ) { }

    async analyze(query: ProjectQuery): Promise<ProjectAnalysis> {
        const hasConfig = this.hasConfiguration(query);

        if (!hasConfig) {
            throw new Error("No configuration found");
        }

        const config = await this.getConfig(query);

        const buildDirectory = this.getBuildDirectory(query, config);

        const analysis = {
            environment: config.environment,
            requiredPorts: this.getRequiredPorts(config),
            buildDirectory: buildDirectory,
            sourceDirectory: this._reader.getProjectVersionPath(query),
            relativeBuildDirectory: config.buildDirectory,
            buildRequired: this.isBuildRequired(query, config),
            dockerfileRequired: this.isDockerfileRequired(query, config),
            dockerfileExists: this.doesDockerfileExist(query, config),
            copyFiles: config.container?.copyFiles ?? [],
            packageManager: config.container?.packageManager ?? "npm",
            env: config.container?.env ?? {},
            type: "full",
            commands: this.getCommands(query, config)
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
        switch (config.environment) {
            case "static":
            case "static-server":
                return [80, 443];
            case "node-server":
                return [...config.serve.ports, ...config.serve.wsPorts ?? []];
        }
    }

    private getBuildDirectory(query: ProjectQuery, config: DockviewConfig): string {
        const basePath = this._reader.getProjectVersionPath(query);

        switch (config.environment) {
            case "static":
            case "static-server":
                return path.join(basePath, config.buildDirectory);
            case "node-server":
                return path.join(basePath, config.buildDirectory);
        }
    }

    private isBuildRequired(query: ProjectQuery, config: DockviewConfig): boolean {
        const contents = this._reader.readProjectVersion(query);

        switch (config.environment) {
            case "static":
            case "static-server":
                return !contents.some(p => p === config.buildDirectory);
            case "node-server":
                return !contents.some(p => p === config.buildDirectory);
        }
    }

    private isDockerfileRequired(query: ProjectQuery, config: DockviewConfig): boolean {
        return config.environment !== "static";
    }

    private doesDockerfileExist(query: ProjectQuery, config: DockviewConfig): boolean {
        const contents = this._reader.readProjectVersion(query);

        return contents.some(p => p === this._dockerfileName);
    }

    private getCommands(query: ProjectQuery, config: DockviewConfig): ProjectAnalysis['commands'] {
        switch (config.environment) {
            case "static":
            case "static-server":
                return {
                    build: config.build.command,
                    start: ["nginx", "-g", "daemon off;"]
                }
            case "node-server":
                return {
                    build: config.build.command,
                    start: config.serve.command
                }
        }
    }
}