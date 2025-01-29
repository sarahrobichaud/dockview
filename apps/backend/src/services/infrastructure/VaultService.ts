import { ProjectDetails, ProjectQuery, ProjectVersionDetail } from "@dockview/core/shared";
import { VaultServiceContract } from "../interfaces/VaultServiceContract";
import { ConfigurationAnalyzerContract } from "~/lib/config-analyzer/ConfigurationAnalyzerContract";
import { VaultRepositoryContract } from "~/repository/interfaces/VaultRepositoryContract";

export class VaultService implements VaultServiceContract{

    private readonly _configAnalyzer: ConfigurationAnalyzerContract;
    private readonly _repository: VaultRepositoryContract;

    constructor(repository: VaultRepositoryContract, configAnalyzer: ConfigurationAnalyzerContract) {

        this._repository = repository;
        this._configAnalyzer = configAnalyzer;
    }

    getProjectList(): ProjectDetails[] {
        const projects = this._repository.getAllProjects();
        return projects;
    }

    getProjectByName(projectName: string): ProjectDetails | null {
        return this._repository.getProjectByName(projectName);
    }

    getProjectByVersion(query: ProjectQuery): ProjectDetails {
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
