export interface DockerServiceContract {
    startContainer(containerName: string): Promise<void>;
    stopContainer(containerName: string): Promise<void>;
}