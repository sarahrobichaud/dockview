import { DockviewInstance } from "~/models/Instance";
import { RequirementList } from "../infrastructure/SetupService";

export interface DockerServiceContract {
    startContainer(containerName: string): Promise<void>;
    stopContainer(containerName: string): Promise<void>;
    createDockerFile(instance: DockviewInstance, requirements: RequirementList): void;
}