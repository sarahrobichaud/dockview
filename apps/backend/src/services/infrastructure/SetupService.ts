import { SetupServiceContract } from "../interfaces/SetupServiceContract";
import type { DockerServiceContract } from "~/services/interfaces/DockerServiceContract";
import { DockviewInstance, DockviewServerInstance } from "@dockview/core/models";
import { ContainerStatus } from "@dockview/core/enums"

export class SetupService implements SetupServiceContract {

    constructor(
        private _dockerService: DockerServiceContract
    ) { }

    async setup(instance: DockviewInstance): Promise<void> {
        console.log("Setting up instance: ", instance.project.name, instance.project.version);
        await this.applyPipeline(instance);
    }

    private async applyPipeline(instance: DockviewInstance): Promise<void> {


        await new Promise(resolve => setTimeout(resolve, 1000));

        instance.logs.logInfo("Evaluating requirements");

        const requirements = this.getRequirements(instance);

        if (requirements.createDockerFile && !instance.shouldAbort) {
            instance.status = ContainerStatus.CREATING_IMAGE;
            instance.logs.logInfo("Creating Docker file");
            this._dockerService.createDockerFile(instance, requirements);
            instance.logs.logInfo("Docker file created");
        }

        if (instance instanceof DockviewServerInstance) {
            instance.status = ContainerStatus.LAUNCHING;
            instance.logs.logInfo("Launching container");
            await this._dockerService.startContainer(instance);
        } else {
            instance.logs.logError("Instance is not a server instance", "Only supporting server instances for now");
        }

        if (instance.shouldAbort) {
            instance.status = ContainerStatus.ABORTED;
            return;
        }

        console.log("Setting instance status to TRANSITION");
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