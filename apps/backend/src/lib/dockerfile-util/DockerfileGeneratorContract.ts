import { DockviewInstance } from "~/models/Instance";
import { RequirementList } from "~/services/infrastructure/SetupService";

export interface DockerfileGeneratorContract {
    generateDockerfile(instance: DockviewInstance, requirements: RequirementList): string;
}