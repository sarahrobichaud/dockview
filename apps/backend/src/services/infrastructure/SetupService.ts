import { inject, injectable, singleton } from "tsyringe";
import { SetupServiceContract } from "../interfaces/SetupServiceContract";
import { TOKENS } from "~/tokens";
import type { DockerServiceContract } from "~/services/interfaces/DockerServiceContract";
import { DockviewInstance, DockviewServerInstance, DockviewStaticInstance } from "@dockview/core/models";
import { log } from "console";
import { ContainerStatus } from "~/types/containerStatus.enum";

@injectable()
export class SetupService implements SetupServiceContract {

    constructor(
        @inject(TOKENS.DockerService) private _dockerService: DockerServiceContract
    ) { }

    async setup(instance: DockviewInstance): Promise<void> {
        console.log("Setting up instance: ", instance.project.name, instance.project.version);
        await this.pipeline(instance);
    }

    private async pipeline(instance: DockviewInstance): Promise<void> {

        const requirements = this.getRequirements(instance);

        if (requirements.createDockerFile && !instance.shouldAbort) {
            this._dockerService.createDockerFile(instance, requirements);
        }

        if (instance instanceof DockviewServerInstance) {
            instance.status = ContainerStatus.SPIN_UP;
            await this._dockerService.startContainer(instance);
        } else {
            instance.logs.logError("Instance is not a server instance", "Only supporting server instances for now");
        }

        if (instance.shouldAbort) {
            instance.status = ContainerStatus.ABORTED;
            return;
        }

        instance.status = ContainerStatus.TRANSITION;
    }


    private getRequirements(instance: DockviewInstance): RequirementList {
        return {
            buildProject: instance.project.analysis.buildRequired,
            createDockerFile: instance.project.analysis.dockerfileRequired,
        }
    }

}

export interface RequirementList {
    buildProject: boolean;
    createDockerFile: boolean;
}