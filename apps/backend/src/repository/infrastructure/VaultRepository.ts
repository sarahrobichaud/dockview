import path from "path";

import { Project, ProjectQuery, ProjectVersion, ProjectWithDetails } from "@dockview/core/shared";
import { VaultRepositoryContract } from "../interfaces/VaultRepositoryContract";
import { VaultReaderContract } from "~/lib/vault-reader/VaultReaderContract";
import { ProjectAnalyzerContract } from "~/lib/project-analyzer/ProjectAnalyzerContract";

export class VaultRepository implements VaultRepositoryContract {

    private readonly _reader: VaultReaderContract;
    private readonly _configAnalyzer: ProjectAnalyzerContract;

    constructor(reader: VaultReaderContract, configAnalyzer: ProjectAnalyzerContract) {
        this._reader = reader;
        this._configAnalyzer = configAnalyzer;
    }


    /**
     * Gets all projects (With valid configurations)
     * @returns 
     */
    getAllProjects(): Project[] {
        const projects = this._reader.readRoot();

        const projectDetails: Project[] = [];

        for(const project of projects) {
            const versions = this._reader.readProject(project);


            const validVersions = versions.filter(version => {
                return this._configAnalyzer.hasConfiguration({name: project, version: this.cleanVersion(version)});
            })

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
    async getAllProjectsWithDetails(): Promise<ProjectWithDetails[]> {
        const projects = this._reader.readRoot();

        const projectDetails: ProjectWithDetails[] = [];


        for(const project of projects) {

            const versions = this._reader.readProject(project);

            const validVersions = versions.filter(version => {
                return this._configAnalyzer.hasConfiguration({name: project, version: this.cleanVersion(version)});
            })


            const details = await Promise.all(validVersions.map(async version => {
                return {
                    name: project,
                    version: version,
                    details: await this._configAnalyzer.analyze({name: project, version: this.cleanVersion(version)})
                } satisfies ProjectVersion;
            }));

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
    getProjectByName(projectName: string): Project | null{

        if(!this.hasProject(projectName)) {
            return null;
        }

        const versions = this._reader.readProject(projectName);

        if(versions.length === 0) {
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
    async getProjectDetails(query: ProjectQuery): Promise<ProjectVersion | null> {

        if(!this.hasProjectVersion(query)) {
            return null;
        }

        if(!this._configAnalyzer.hasConfiguration(query)) {
            return null;
        }

        return {
            name: query.name,
            version: query.version,
            details: await this._configAnalyzer.analyze(query)
        };
    }

    getProjectVersions(projectName: string): string[] {
        return this._reader.readProject(projectName);
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

}