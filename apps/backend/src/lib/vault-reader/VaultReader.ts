import path from "path";
import fs from "fs";
import { VaultReaderContract } from "./VaultReaderContract";
import { ProjectQuery } from "@dockview/core/shared";

import { injectable } from "tsyringe";


@injectable()
export class VaultReader implements VaultReaderContract {

    public readonly _vaultPath: string;
    public readonly _versionSeparator = "-v";
    private readonly ignoreList = ["node_modules", ".git", ".DS_Store", ".vscode", "README.md"];

    /**
     * 
     * @param path - The path to the vault
     * @param configAnalyzer - The configuration analyzer
     * @throws Error if the vault does not exist
     * 
     * The vault path should be relative
     */
    constructor(vaultLocation: string) {

        // Handle both "./vault" and "vault"
        this._vaultPath = vaultLocation.startsWith("./") ? vaultLocation : `./${vaultLocation}`;

        // Check if the vault exists
        if(!fs.existsSync(this._vaultPath)){
            throw new Error(`Vault does not exist here: ${this._vaultPath}`);
        }
    }

    get vaultPath(): string {
        return this._vaultPath;
    }

    get versionSeparator(): string {
        return this._versionSeparator;
    }

    /**
     * Reads the root of the vault
     * @returns A list of all folders in the vault root
     */
    readRoot(): string[] {
        return this.read(this._vaultPath);
    }

    /**
     * Reads the contents of a project
     * @param projectName - The name of the project
     * @returns A list of all folders in the project
     */
    readProject(projectName: string): string[] {
        return this.read(this.getProjectPath(projectName));
    }

    /**
     * Reads a specific version of a project
     * @param query - The project query
     * @returns A list of all files in the project version
     */
    readProjectVersion(query: ProjectQuery): string[] {
        return this.read(this.getProjectVersionPath(query));
    }

    /** 
     * Path Builders
     */
    getProjectPath(projectName: string): string {
        return path.join(this.vaultPath, projectName);
    }

    getProjectVersionPath({name, version}: ProjectQuery): string {
        const targetFolder = name + this.versionSeparator + version;
        return path.join(this.getProjectPath(name), targetFolder, "source");
    }

    getConfigPath(query: ProjectQuery, configName: string): string {
        return path.join(this.getProjectVersionPath(query), configName);
    }


    private read(path: string){
        try{

            const vaultContents = fs.readdirSync(path);
            return vaultContents.filter(item => !this.ignoreList.includes(item));

        } catch (error) {

            if(error instanceof Error) {
                console.log(`[VaultReader] Failed to read: ${error.message}`);
            }

            return [];
        }
    }
}