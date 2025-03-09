import { DockviewInstance } from "@dockview/core/models";
import { RequirementList } from "~/services/infrastructure/SetupService.js";

export interface DockerfileGeneratorContract {
    generateDockerfile(instance: DockviewInstance, requirements: RequirementList): string;
}