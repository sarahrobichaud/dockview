import { InstanceRequestResponse } from "@dockview/core/api/responses/instance";
import { InstanceServiceContract } from "../interfaces/InstanceServiceContract";
import { ProjectQuery } from "@dockview/core/shared";
import { InstanceManager } from "~/lib/instance-manager/InstanceManager";
import { DockerService } from "./DockerService";
import { inject, injectable, singleton } from "tsyringe";
import { DockviewInstance } from "~/models/Instance";
import { TOKENS } from "~/tokens";

@singleton()
export class InstanceService implements InstanceServiceContract {

    constructor(
        @inject(TOKENS.InstanceManager) private _instanceManager: InstanceManager,
        @inject(TOKENS.DockerService) private _dockerService: DockerService
    ) {}

    async request(query: ProjectQuery): Promise<InstanceRequestResponse> {
        console.log({instanceManager: this._instanceManager});

        console.log({instanceManager: this._instanceManager});

        this._instanceManager.register(new DockviewInstance('server', 'test', '1.0.0'));

        return {
            cold: true,
            containerURL: "",
            statusURL: ""
        }
    }
};