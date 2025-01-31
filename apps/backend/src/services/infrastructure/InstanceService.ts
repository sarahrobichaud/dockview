import { InstanceRequestResponse } from "@dockview/core/api/responses/instance";
import { InstanceServiceContract } from "../interfaces/InstanceServiceContract";
import { ProjectQuery } from "@dockview/core/shared";

export class InstanceService implements InstanceServiceContract {
    async request(query: ProjectQuery): Promise<InstanceRequestResponse> {
        

        return {
            cold: true,
            containerURL: "",
            statusURL: ""
        }
    }
};