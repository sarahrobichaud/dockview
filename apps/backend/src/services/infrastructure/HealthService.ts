import { inject, injectable } from "tsyringe";
import { TOKENS } from "~/tokens";
import type { HealthServiceContract } from "~/services/interfaces/HealthServiceContract";
import type { InstanceServiceContract } from "../interfaces/InstanceServiceContract";

@injectable()
export class HealthService implements HealthServiceContract {
    constructor(
        @inject(TOKENS.InstanceService) private _instanceService: InstanceServiceContract,
    ) { }

    async getStatus(containerID: string): Promise<any> {

        const instance = this._instanceService.getByID(containerID);

        return instance.dto;
    }
}