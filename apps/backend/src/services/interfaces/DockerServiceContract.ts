import { DockviewInstance, DockviewServerInstance } from "~/models/Instance";
import { RequirementList } from "../infrastructure/SetupService";

export interface DockerServiceContract {
    startContainer(instance: DockviewServerInstance): Promise<void>;
    stopContainer(instance: DockviewServerInstance): Promise<void>;
    createDockerFile(instance: DockviewInstance, requirements: RequirementList): void;
}