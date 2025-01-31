import { InstanceRequestResponse } from "@dockview/core/api/responses";
import { ProjectQuery } from "@dockview/core/shared";

export interface InstanceServiceContract {
    request(query: ProjectQuery): Promise<InstanceRequestResponse>;
}