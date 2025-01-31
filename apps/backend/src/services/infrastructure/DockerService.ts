import { DockerServiceContract } from "~/services/interfaces/DockerServiceContract";
import { inject, injectable } from "tsyringe";

@injectable()
export class DockerService implements DockerServiceContract {

    startContainer(containerName: string): Promise<void> {
        throw new Error("Method not implemented.");
    }

    stopContainer(containerName: string): Promise<void> {
        throw new Error("Method not implemented.");
    }

}