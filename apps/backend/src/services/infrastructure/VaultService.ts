import { LimitedProjectDetails, LimitedProjectVersion, Project, ProjectQuery, ProjectVersion, } from "@dockview/core/shared";
import { VaultServiceContract } from "../interfaces/VaultServiceContract";
import { ProjectAnalyzerContract } from "~/lib/project-analyzer/ProjectAnalyzerContract";
import { VaultRepositoryContract } from "~/repository/interfaces/VaultRepositoryContract";

export class VaultService implements VaultServiceContract{

    private readonly _vaultRepository: VaultRepositoryContract;

    constructor(vaultRepository: VaultRepositoryContract) {
        this._vaultRepository = vaultRepository;
    }

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
