import { DockviewInstancePublicDTO } from "@dockview/core/models";

export interface HealthServiceContract {
    getPublicStatus(containerID: string): Promise<DockviewInstancePublicDTO>;
}