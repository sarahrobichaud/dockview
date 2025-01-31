import { DockviewInstance, DockviewServerInstance } from "~/models/Instance";
import { InstanceManagerContract } from "./InstanceManagerContract";
import { ProjectQuery } from "@dockview/core/shared";
import { stopAndRemoveContainerByID } from "~/containers/docker/docker-cleanup";
import { inject, injectable, singleton } from "tsyringe";

export interface onDestroy {
    onDestroy(): Promise<void>;
}

@singleton()
export class InstanceManager implements InstanceManagerContract {

    private readonly _instances: Map<string, DockviewInstance> = new Map();
    private readonly _projects: Map<string, Set<string>> = new Map();

    private readonly _logCounts_DEV = true;
    private readonly _cleanUpInterval = 1000 * 15; // 15 seconds
    private _cleanupTimer: ReturnType<typeof setInterval> | null = null;


    constructor(
        instancesStorage: Map<string, DockviewInstance>,
        projectStorage: Map<string, Set<string>>
    ) {
        console.log("Creating new instance manager");
        this._instances = instancesStorage;
        this._projects = projectStorage;

        this.startDevLogger();
        this.startCleanupRoutine();
    }

    private startCleanupRoutine(): void {
        this._cleanupTimer = setInterval(
            () => this.cleanUpRoutine(),
            this._cleanUpInterval
        );
    }

    private startDevLogger(): void {
        setInterval(() => {
            console.log({
                instanceCount: this._instances.size,
                projectCount: this._projects.size,
            });
        }, 2000);
    }

    async onDestroy(): Promise<void> {
        console.log("Cleaning up instance manager");
        // Clear intervals
        if (this._cleanupTimer) {
            clearInterval(this._cleanupTimer);
        }

        // Cleanup all instances
        const cleanupPromises = Array.from(this._instances.values()).map(
            async (instance) => {
                try {
                    await this.remove(instance);
                } catch (error) {
                    console.error(`Failed to cleanup instance:`, error);
                }
            }
        );

        await Promise.all(cleanupPromises);
    }

    register(instance: DockviewInstance): void {
        const projectKey = this.getProjectKey({name: instance.project, version: instance.version});;


        if(!this._projects.has(projectKey)){
            this._projects.set(projectKey, new Set());
        }

        this._projects.get(projectKey)!.add(instance.id);
        this._instances.set(instance.id, instance);

    }

    remove(instance: DockviewInstance): void {
        this.shutdownInstance(instance, "it was removed manually");
    }

    getByID(id: string): DockviewInstance | null {
        return this._instances.get(id) ?? null;
    }

    getExisting(query: ProjectQuery): DockviewInstance | null {
        const projectKey = this.getProjectKey(query);

        if(!this._projects.has(projectKey)) return null;

        return this.grabExistingInstance(projectKey);
    }

    /**
     * Grabs the first instance of a project
     * @param projectKey 
     * @returns 
     */
    private grabExistingInstance(projectKey: string): DockviewInstance | null {
        const existingIDs = this._projects.get(projectKey)!;

        if(existingIDs.size === 0) return null;

        const instance = this._instances.get(Array.from(existingIDs)[0]);

        return instance ?? null;
    }

    /**
     * Returns a key for a project
     * @param query 
     * @returns 
     */
    private getProjectKey(query: ProjectQuery): string {
        return `${query.name}::${query.version}`;
    }


    /**
     * Cleans up idle instances
     */
    private cleanUpRoutine(): void {

        this.log("[ContainerManager] Cleaning up containers");

        const now = Date.now();
        const idleTimeout = 1 * 10 * 1000; // 1 minute

        this._instances.forEach(async (instance, id) => {

            // Check if the instance has been idle for too long
            if(now - instance.lastAccessed > idleTimeout && instance.activeConnections === 0){
                await this.shutdownInstance(instance, "it was idle for too long");
            }
        });
    }

    /**
     * Logs the number of instances and projects
     */
    private devLogger(): void {
        if(process.env.NODE_ENV === "development" && this._logCounts_DEV){
            setInterval(() => {
                console.log({
                    instanceCount: this._instances.size,
                    projectCount: this._projects.size,
                });
            }, 1000);
        }
    }

    private log(message: string): void {
        if(process.env.NODE_ENV === "development"){
            console.log(`[InstanceManager] ${message}`);
        }
    }

    /**
     * Shuts down an instance
     * @param instance 
     * @param reason 
     */
    private async shutdownInstance(instance: DockviewInstance, reason: string): Promise<void> {
            this.log(`[InstanceManager] Removing instance ${instance.id} because ${reason}`);

            this._instances.delete(instance.id);

            const key = this.getProjectKey({name: instance.project, version: instance.version});

            if(!key) return;

            // If server instance, stop and remove the container
            if(instance instanceof DockviewServerInstance){
                await stopAndRemoveContainerByID(instance.id);
            }

            this._projects.get(key)!.delete(instance.id);

            if(this._projects.get(key)!.size === 0){
                this._projects.delete(key);
            }
    }
}