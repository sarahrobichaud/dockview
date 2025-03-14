import { InstanceRequestResponse } from "@dockview/core/api/responses";
import { ProjectQueryWithAnalysis } from "@dockview/core/shared";

import { DockviewInstance } from "@dockview/core/models";
import { InstanceServiceContract } from "../interfaces/InstanceServiceContract.js";

import FileTreeBuilder, { FileNode, FolderNode } from "~/lib/filetree-builder/filetree.js";
import type { InstanceManagerContract } from "~/lib/instance-manager/InstanceManagerContract.js";
import type { VaultRepositoryContract } from "~/repository/interfaces/VaultRepositoryContract.js";
import type { SetupServiceContract } from "../interfaces/SetupServiceContract.js";

export class InstanceService implements InstanceServiceContract {

    private readonly _protocol = process.env.PROTOCOL || "http";
    private readonly _prefix = "dv--";
    private readonly _baseDomain = `${process.env.DOMAIN || "localhost"}${process.env.NODE_ENV === "production" && process.env.PROTOCOL === "https" ? "" : `:${process.env.PORT}`}`;

    constructor(
        private _instanceManager: InstanceManagerContract,
        private _setupService: SetupServiceContract,
        private _vaultRepository: VaultRepositoryContract
    ) { }


    getByID(id: string): DockviewInstance {
        console.log("Getting instance by ID: ", id);
        const instance = this._instanceManager.getByID(id);

        if (!instance) {
            throw new Error("Instance not found");
        }

        return instance;
    }


    async request(query: ProjectQueryWithAnalysis): Promise<InstanceRequestResponse> {

        const existingInstance = await this.getExistingInstance(query);

        if (existingInstance) {
            return {
                cold: !existingInstance.isReady,
                containerURL: this.getContainerURL(existingInstance),
                statusURL: this.getStatusURL(existingInstance)
            }
        }

        const instance = this._instanceManager.createDockviewInstance(query);

        this._instanceManager.register(instance);

        const urls = this.getURLs(instance);

        this._setupService.setup(instance);

        return {
            cold: !instance.isReady,
            containerURL: urls.containerURL,
            statusURL: urls.statusURL
        }
    }

    private async getExistingInstance(query: ProjectQueryWithAnalysis): Promise<DockviewInstance | null> {
        return this._instanceManager.getExisting({
            name: query.name,
            version: query.version
        });
    }


    private getStatusURL(instance: DockviewInstance): string {
        return `${this._protocol}://${this._prefix}${instance.id}.${this._baseDomain}/monitor`;
    }

    private getContainerURL(instance: DockviewInstance): string {
        return `${this._protocol}://${this._prefix}${instance.id}.${this._baseDomain}`;
    }

    private getURLs(instance: DockviewInstance): { containerURL: string, statusURL: string } {
        return {
            containerURL: this.getContainerURL(instance),
            statusURL: this.getStatusURL(instance)
        }
    }

    getFiles(instance: DockviewInstance): (FolderNode | FileNode)[] {
        return this.buildFileTree(instance).sort(FileTreeBuilder.sortNodes)
    }

    private buildFileTree(instance: DockviewInstance): (FolderNode | FileNode)[] {
        const sourceContent = this._vaultRepository.scanProject(instance.project);
        return sourceContent;
    }




    /**
     * What do I need here:
     * 1. Get analysis of the project
     * 2. Send response with details and start container process in the background (choose between static and server pipeline)
     * 3. Apply requirements to the project folder (build, create dockerfile, etc)
     * 4. Create a docker image
     * 5. Run the docker image
     */
};