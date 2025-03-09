
import { LimitedProjectDetails, LimitedProjectVersion, Project, ProjectQuery } from "@dockview/core/shared";
import { FileNode, FolderNode } from "~/lib/filetree-builder/filetree";
import type { ProjectAnalyzerContract } from "~/lib/project-analyzer/ProjectAnalyzerContract";
import type { VaultReaderContract } from "~/lib/vault-reader/VaultReaderContract";
import { VaultRepositoryContract } from "../interfaces/VaultRepositoryContract";

export class VaultRepository implements VaultRepositoryContract {

    constructor(
        private _reader: VaultReaderContract,
        private _configAnalyzer: ProjectAnalyzerContract
    ) {

    }

    scanProject(query: ProjectQuery): (FolderNode | FileNode)[] {
        return this._reader.scanProject(query);
    }

    /**
     * Gets all projects (With valid configurations)
     * @returns 
     */
    getAllProjects(): Project[] {
        const projects = this._reader.readRoot();

        const projectDetails: Project[] = [];

        for (const project of projects) {

            const validVersions = this.getValidVersions(project);

            projectDetails.push({
                name: project,
                versions: validVersions.map(this.cleanVersion)
            });
        }

        return projectDetails;
    }
    /**
     * Gets all projects and version details (With valid configurations)
     * @returns 
     */
    async getAllProjectsWithDetails(): Promise<LimitedProjectDetails[]> {
        const projects = this._reader.readRoot();

        const projectDetails: LimitedProjectDetails[] = [];


        for (const project of projects) {

            const validVersions = this.getValidVersions(project);



            const details = await Promise.all(validVersions.map(async (version): Promise<LimitedProjectVersion> => {
                const analysis = await this._configAnalyzer.analyze({ name: project, version: this.cleanVersion(version) });

                const limitedAnalysis = {
                    environment: analysis.environment,
                    buildRequired: analysis.buildRequired,
                    type: "limited"
                } as const;

                return {
                    name: project,
                    version: this.cleanVersion(version),
                    details: limitedAnalysis
                };
            }));
            console.log("details", details);

            projectDetails.push({
                name: project,
                versions: details
            });
        }

        return projectDetails;
    }

    /**
     * Gets a project by name and available versions
     * @param projectName - The name of the project
     * @returns The project or null if it doesn't exist
     */
    getProjectByName(projectName: string): Project | null {

        if (!this.hasProject(projectName)) {
            return null;
        }

        const versions = this._reader.readProject(projectName);

        if (versions.length === 0) {
            return null;
        }

        return {
            name: projectName,
            versions: versions.map(this.cleanVersion)
        };
    }

    /**
     * Gets a project version details
     * @param query - The project query
     * @returns The project version details or null if it doesn't exist
     */
    async getProjectDetails(query: ProjectQuery): Promise<LimitedProjectVersion | null> {

        if (!this.hasProjectVersion(query)) {
            return null;
        }

        if (!this._configAnalyzer.hasConfiguration(query)) {
            return null;
        }

        const analysis = await this._configAnalyzer.analyze(query);

        const limitedAnalysis = {
            environment: analysis.environment,
            buildRequired: analysis.buildRequired,
            type: "limited"
        } as const;

        return {
            name: query.name,
            version: this.cleanVersion(query.version),
            details: limitedAnalysis
        };
    }

    async getFileContent(path: string): Promise<string | null> {
        return await this._reader.getFileContent(path);
    }

    async getProjectVersions(projectName: string): Promise<LimitedProjectVersion[]> {

        if (!this.hasProject(projectName)) {
            return Promise.resolve([]);
        }


        const validVersions = this.getValidVersions(projectName);

        const details = await Promise.all(validVersions.map(async (version) => {
            const analysis = await this._configAnalyzer.analyze({ name: projectName, version: this.cleanVersion(version) });

            const limitedAnalysis = {
                environment: analysis.environment,
                buildRequired: analysis.buildRequired,
                type: "limited"
            } as const;

            return {
                name: projectName,
                version: this.cleanVersion(version),
                details: limitedAnalysis
            };
        }));


        return details;
    }

    hasProject(projectName: string): boolean {
        return this._reader.readRoot().includes(projectName);
    }

    hasProjectVersion(query: ProjectQuery): boolean {
        return this._reader.readProject(query.name).map(this.cleanVersion).includes(query.version);
    }

    /**
     * Cleans the version string to remove name and version separator
     * @param version - Folder name
     * @returns The version string
     * 
     * Is an arrow function to keep the context of the class
     */
    private cleanVersion = (version: string): string => {
        const parts = version.split(this._reader.versionSeparator);
        const lastPart = parts[parts.length - 1];

        return lastPart;
    }

    private getValidVersions(projectName: string): string[] {
        const versions = this._reader.readProject(projectName);
        return versions.filter(version => {
            return this._configAnalyzer.hasConfiguration({ name: projectName, version: this.cleanVersion(version) });
        });
    }

}