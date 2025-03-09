import { DockviewInstancePublicDTO } from "@dockview/core/models";
import type { HealthServiceContract } from "~/services/interfaces/HealthServiceContract";
import type { InstanceServiceContract } from "../interfaces/InstanceServiceContract";

export class HealthService implements HealthServiceContract {
    constructor(
        private _instanceService: InstanceServiceContract,
    ) { }

    async getPublicStatus(containerID: string): Promise<DockviewInstancePublicDTO> {

        console.log({ test: this._instanceService })
        const instance = this._instanceService.getByID(containerID);

        return instance.toPublicDTO();
    }
}