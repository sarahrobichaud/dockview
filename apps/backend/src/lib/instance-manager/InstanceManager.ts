import { DockviewInstance, DockviewServerInstance, DockviewStaticInstance } from "@dockview/core/models";
import { InstanceManagerContract } from "./InstanceManagerContract";
import { ProjectQuery, ProjectQueryWithAnalysis } from "@dockview/core/shared";
import { singleton } from "tsyringe";
import { ContainerStatus } from "~/types/containerStatus.enum";

import fs from "fs";
import path from "path";

export interface onDestroy {
    onDestroy(): Promise<void>;
}

@singleton()
export class InstanceManager implements InstanceManagerContract {

    private readonly _instances: Map<string, DockviewInstance> = new Map();
    private readonly _projects: Map<string, Set<string>> = new Map();

    private readonly _logCounts_DEV = true;
    private readonly _cleanUpInterval = 1000 * 45; // 15 seconds
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

    createDockviewInstance(query: ProjectQueryWithAnalysis): DockviewInstance {

        switch (query.analysis.environment) {
            case "static":
                return new DockviewStaticInstance(query);
            case "node-server":
            case "static-server":
                return new DockviewServerInstance(query);
            default:
                throw new Error(`Unsupported environment: ${query.analysis.environment}`);
        }
    }

    register(instance: DockviewInstance): void {
        const projectKey = this.getProjectKey(instance.project);


        if (!this._projects.has(projectKey)) {
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

        if (!this._projects.has(projectKey)) return null;

        return this.grabExistingInstance(projectKey);
    }

    private get validInstances(): readonly DockviewInstance[] {
        return Array.from(this._instances.values()).filter(instance => instance.status !== ContainerStatus.ABORTED);
    }

    /**
     * Grabs the first instance of a project
     * @param projectKey 
     * @returns 
     */
    private grabExistingInstance(projectKey: string): DockviewInstance | null {
        const existingIDs = this._projects.get(projectKey)!;

        if (existingIDs.size === 0) return null;

        const instance = this.validInstances.find(i => existingIDs.has(i.id));

        console.log({ existingIDs });

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
        const idleTimeout = 60 * 1000; // 1 minute

        this._instances.forEach(async (instance, id) => {

            if (instance.status === ContainerStatus.ABORTED) {
                await this.shutdownInstance(instance, "it was aborted");
                return;
            }

            // Check if the instance has been idle for too long
            if (now - instance.lastAccessed > idleTimeout && instance.activeConnections === 0 && instance.status !== ContainerStatus.SPIN_UP) {
                await this.shutdownInstance(instance, "it was idle for too long");
            }
        });
    }

    /**
     * Logs the number of instances and projects
     */
    private devLogger(): void {
        if (process.env.NODE_ENV === "development" && this._logCounts_DEV) {
            setInterval(() => {
                console.log({
                    instanceCount: this._instances.size,
                    projectCount: this._projects.size,
                });
            }, 1000);
        }
    }

    private log(message: string): void {
        if (process.env.NODE_ENV === "development") {
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

        const key = this.getProjectKey(instance.project);

        if (!key) return;

        // If server instance, stop and remove the container
        if (instance instanceof DockviewServerInstance) {

            try {
                const container = instance.container;

                if (!container) return;

                instance.logs.logInfo("Stopping container", instance.id);

                await container.self.stop();

                instance.logs.logInfo("Container stopped", instance.id);

                instance.logs.logInfo("Removing container", instance.id);
                await container.self.remove();

                instance.logs.logInfo("Container removed", instance.id);
                // await stopAndRemoveContainerByID(instance.id);
            } catch (err) {
                instance.logs.logInfo("Container will be added to cleanup routine", instance.id);
                instance.logs.logError("Failed to stop container", instance.id);
            }
        }

        this._projects.get(key)!.delete(instance.id);

        if (this._projects.get(key)!.size === 0) {
            this._projects.delete(key);
        }
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
}