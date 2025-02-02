export interface HealthServiceContract {
    getStatus(containerID: string): Promise<any>;
}