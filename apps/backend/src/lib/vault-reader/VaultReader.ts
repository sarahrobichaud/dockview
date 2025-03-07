import path from "path";
import fs from "fs";
import { VaultReaderContract } from "./VaultReaderContract";
import { ProjectQuery } from "@dockview/core/shared";

import { injectable } from "tsyringe";
import { FileNode, FolderNode, TreeNode } from "../filetree-builder/filetree";


@injectable()
export class VaultReader implements VaultReaderContract {

    public readonly _vaultPath: string;
    public readonly _versionSeparator = "-v";
    private readonly ignoreList = ["node_modules", ".git", ".DS_Store", ".vscode", "README.md", ".gitignore"];

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
        if (!fs.existsSync(this._vaultPath)) {
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
        return this.readDirectory(this._vaultPath);
    }

    /**
     * Reads the contents of a project
     * @param projectName - The name of the project
     * @returns A list of all folders in the project
     */
    readProject(projectName: string): string[] {
        return this.readDirectory(this.getProjectPath(projectName));
    }

    /**
     * Reads a specific version of a project
     * @param query - The project query
     * @returns A list of all files in the project version
     */
    readProjectVersion(query: ProjectQuery): string[] {
        return this.readDirectory(this.getProjectVersionPath(query));
    }

    /** 
     * Path Builders
     */
    getProjectPath(projectName: string): string {
        return path.join(this.vaultPath, projectName);
    }

    getProjectVersionPath({ name, version }: ProjectQuery): string {
        const targetFolder = name + this.versionSeparator + version;
        return path.join(this.getProjectPath(name), targetFolder, "source");
    }

    getConfigPath(query: ProjectQuery, configName: string): string {
        return path.join(this.getProjectVersionPath(query), configName);
    }

    scanProject(projectName: ProjectQuery): (FolderNode | FileNode)[] {
        const searchPath = this.getProjectVersionPath(projectName);
        return this.buildFileTree(searchPath);
    }

    private buildFileTree(directory: string, level = 0): (FolderNode | FileNode)[] {
        const items = fs.readdirSync(directory);
        const tree: (FolderNode | FileNode)[] = [];

        items.forEach((item) => {
            const fullPath = path.join(directory, item);
            const stats = fs.lstatSync(fullPath);
            const isHidden = item.startsWith(".");

            if (item === ".git") return;

            // Create a custom object for each node
            const node = {
                name: item,
                path: fullPath.replace(this._vaultPath, ""),
                type: stats.isDirectory() ? "folder" : "file",
                isHidden,
                level,
                children: [],
                key: fullPath,
            } as (FolderNode | FileNode);

            if (node.type === "folder") {
                node.children = this.buildFileTree(fullPath, level + 1); // Recursively build the tree for subdirectories
            }

            // Add the node to the tree array
            tree.push(node);
        });

        return tree;
    }

    async getFileContent(path: string): Promise<string | null> {
        return await this.readFile(path).catch(() => null);
    }

    private async readFile(path: string): Promise<string> {
        return new Promise(async (resolve, reject) => {
            try {
                const content = await fs.promises.readFile(path, "utf8");
                resolve(content);
            } catch (error) {
                if (error instanceof Error) {
                    console.log(`[VaultReader] Failed to read: ${error.message}`);
                }
                reject(null);
            }
        });
    }

    private readDirectory(path: string) {
        try {

            const vaultContents = fs.readdirSync(path);
            return vaultContents.filter(item => !this.ignoreList.includes(item));

        } catch (error) {

            if (error instanceof Error) {
                console.log(`[VaultReader] Failed to read: ${error.message}`);
            }

            return [];
        }
    }
}