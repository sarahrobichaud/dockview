import { DockviewInstance, DockviewServerInstance } from "@dockview/core/models";
import { RequirementList } from "../infrastructure/SetupService.js";

export interface DockerServiceContract {
    startContainer(instance: DockviewServerInstance): Promise<void>;
    stopContainer(instance: DockviewServerInstance): Promise<void>;
    createDockerFile(instance: DockviewInstance, requirements: RequirementList): void;
}