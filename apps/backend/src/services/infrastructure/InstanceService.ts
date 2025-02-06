import { InstanceRequestResponse } from "@dockview/core/api/responses";
import { ProjectQueryWithAnalysis } from "@dockview/core/shared";
import { inject, instanceCachingFactory, singleton } from "tsyringe";

import { DockviewInstance, DockviewServerInstance } from "@dockview/core/models";
import { TOKENS } from "~/tokens";
import { InstanceServiceContract } from "../interfaces/InstanceServiceContract";

import type { DockerServiceContract } from "~/services/interfaces/DockerServiceContract";
import type { InstanceManagerContract } from "~/lib/instance-manager/InstanceManagerContract";
import type { SetupServiceContract } from "../interfaces/SetupServiceContract";

@singleton()
export class InstanceService implements InstanceServiceContract {

    private readonly _protocol = process.env.NODE_ENV === "production" ? "https" : "http";
    private readonly _prefix = "dv--";
    private readonly _baseDomain = `${process.env.DOMAIN || "localhost"}${process.env.NODE_ENV === "production" ? "" : `:${process.env.PORT}`}`;

    constructor(
        @inject(TOKENS.InstanceManager) private _instanceManager: InstanceManagerContract,
        @inject(TOKENS.DockerService) private _dockerService: DockerServiceContract,
        @inject(TOKENS.SetupService) private _setupService: SetupServiceContract
    ) { }

    getByID(id: string): DockviewInstance {
        const instance = this._instanceManager.getByID(id);

        if (!instance) {
            throw new Error("Instance not found");
        }

        return instance;
    }


    async request(query: ProjectQueryWithAnalysis): Promise<InstanceRequestResponse> {

        const instance = this._instanceManager.createDockviewInstance(query);

        this._instanceManager.register(instance);

        const urls = this.getURLs(instance);

        this._setupService.setup(instance);

        return {
            cold: instance.isReady,
            containerURL: urls.containerURL,
            statusURL: urls.statusURL
        }
    }


    private getStatusURL(instance: DockviewInstance): string {
        return `${this._protocol}://monitor.${this._baseDomain}/${instance.id}`;
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



    /**
     * What do I need here:
     * 1. Get analysis of the project
     * 2. Send response with details and start container process in the background (choose between static and server pipeline)
     * 3. Apply requirements to the project folder (build, create dockerfile, etc)
     * 4. Create a docker image
     * 5. Run the docker image
     */
};