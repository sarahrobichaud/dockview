import fs from "fs";

import { ProjectDetails, ProjectQuery, ProjectVersionDetail } from "@dockview/core/shared";
import { VaultRepositoryContract } from "../interfaces/VaultRepositoryContract";
import { VaultReaderContract } from "~/lib/vault-reader/VaultReaderContract";

export class VaultRepository implements VaultRepositoryContract {

    private readonly _reader: VaultReaderContract;

    constructor(reader: VaultReaderContract) {
        this._reader = reader;
    }

    getAllProjects(): ProjectDetails[] {
        const projects = this._reader.readRoot();

        const projectDetails: ProjectDetails[] = [];


        for(const project of projects) {
            const versions = this._reader.readProject(project);
            projectDetails.push({
                name: project,
                versions: this._reader.readProject(project).map(this.cleanVersion)
            });
        }

        return projectDetails;
    }

    getProjectByName(projectName: string): ProjectDetails | null{

        const versions = this._reader.readProject(projectName);

        if(versions.length === 0) {
            return null;
        }

        return {
            name: projectName,
            versions: versions.map(this.cleanVersion)
        };
    }

    getProjectByVersion(query: ProjectQuery): ProjectDetails {
        throw new Error("Method not implemented.");
    }

    getProjectVersions(projectName: string): string[] {
        return this._reader.readProject(projectName);
    }

    hasProject(projectName: string): boolean {
        throw new Error("Method not implemented.");
    }

    hasProjectVersion(query: ProjectQuery): boolean {
        throw new Error("Method not implemented.");
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

        return lastPart.replaceAll('v', "");
    }
}