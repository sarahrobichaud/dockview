import { InstanceRequestResponse } from "@dockview/core/api/responses";
import { ProjectAnalysis, ProjectQuery, ProjectQueryWithAnalysis } from "@dockview/core/shared";

export interface InstanceServiceContract {
    request(query: ProjectQueryWithAnalysis): Promise<InstanceRequestResponse>;
}