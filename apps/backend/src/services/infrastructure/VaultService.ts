import { Project, ProjectQuery, ProjectVersion, ProjectWithDetails } from "@dockview/core/shared";
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
    
    async getDetailedProjectList(): Promise<ProjectWithDetails[]> {
        return await this._vaultRepository.getAllProjectsWithDetails();
    }

    async getProjectDetails(query: ProjectQuery): Promise<ProjectVersion | null> {
        return await this._vaultRepository.getProjectDetails(query);
    }

    getProjectByName(projectName: string): Project | null {
        return this._vaultRepository.getProjectByName(projectName);
    }

    getProjectByVersion(query: ProjectQuery): ProjectVersion | null {
        throw new Error("Method not implemented.");
    }

    getProjectVersions(projectName: string): string[] {
        throw new Error("Method not implemented.");
    }

    hasProject(projectName: string): boolean {
        throw new Error("Method not implemented.");
    }

    hasProjectVersion(query: ProjectQuery): boolean {
        throw new Error("Method not implemented.");
    }

}
