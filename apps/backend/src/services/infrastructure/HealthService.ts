import { inject, injectable } from "tsyringe";
import { TOKENS } from "~/tokens";
import type { HealthServiceContract } from "~/services/interfaces/HealthServiceContract";
import type { InstanceServiceContract } from "../interfaces/InstanceServiceContract";
import { DockviewInstancePublicDTO } from "@dockview/core/models";

@injectable()
export class HealthService implements HealthServiceContract {
    constructor(
        @inject(TOKENS.InstanceService) private _instanceService: InstanceServiceContract,
    ) { }

    async getPublicStatus(containerID: string): Promise<DockviewInstancePublicDTO> {

        console.log({test: this._instanceService})
        const instance = this._instanceService.getByID(containerID);

        return instance.toPublicDTO();
    }
}