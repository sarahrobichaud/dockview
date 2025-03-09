import { LimitedProjectDetails, LimitedProjectVersion, Project, ProjectQuery, ProjectVersion, } from "@dockview/core/shared";
import { VaultServiceContract } from "../interfaces/VaultServiceContract.js";
import type { VaultRepositoryContract } from "~/repository/interfaces/VaultRepositoryContract.js";

export class VaultService implements VaultServiceContract {

    constructor(
        private _vaultRepository: VaultRepositoryContract
    ) { }

    getProjectList(): Project[] {
        const projects = this._vaultRepository.getAllProjects();
        return projects;
    }

    async getDetailedProjectList(): Promise<LimitedProjectDetails[]> {
        return await this._vaultRepository.getAllProjectsWithDetails();
    }

    async getPublicProjectDetails(query: ProjectQuery): Promise<LimitedProjectVersion | null> {
        return await this._vaultRepository.getProjectDetails(query);
    }

    getPublicProjectByName(projectName: string): Project | null {
        return this._vaultRepository.getProjectByName(projectName);
    }

    async getFileContent(path: string): Promise<string | null> {
        return await this._vaultRepository.getFileContent(path);
    }

    getPublicProjectByVersion(query: ProjectQuery): LimitedProjectVersion | null {
        throw new Error("Method not implemented.");
    }

    getPublicProjectVersions(projectName: string): Promise<LimitedProjectVersion[]> {
        console.log("getProjectVersions", projectName);
        return this._vaultRepository.getProjectVersions(projectName);
    }

    hasProject(projectName: string): boolean {
        throw new Error("Method not implemented.");
    }

    hasProjectVersion(query: ProjectQuery): boolean {
        return this._vaultRepository.hasProjectVersion(query);
    }

}
