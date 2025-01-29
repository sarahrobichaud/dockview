import path from "path";
import fs from "fs";
import { VaultReaderContract } from "./VaultReaderContract";
import { ProjectQuery } from "@dockview/core/shared";

export class VaultReader implements VaultReaderContract {


    public readonly _vaultPath: string;
    public readonly _versionSeparator = "-";
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
        const target = path.join(this._vaultPath, projectName);
        return this.read(target);
    }

    /**
     * Reads a specific version of a project
     * @param query - The project query
     * @returns A list of all files in the project version
     */
    readProjectVersion(query: ProjectQuery): string[] {
        const folderName = `${query.name}${this._versionSeparator}${query.version}`;
        const target = path.join(this._vaultPath, query.name, folderName);
        return this.read(target);
    }

    private read(path: string){
        try{

            const vaultContents = fs.readdirSync(path);;
            return vaultContents.filter(item => !this.ignoreList.includes(item));

        } catch (error) {

            if(error instanceof Error) {
                console.log(`[VaultReader] Failed to read: ${error.message}`);
            }

            return [];
        }
    }
}