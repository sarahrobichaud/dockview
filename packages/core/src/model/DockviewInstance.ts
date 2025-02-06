
import {
    ContainerStatus,
    ContainerStatusKey,
} from "@dockview/core/enums";

import { customAlphabet } from "@dockview/core/common";

import { ProjectQueryWithAnalysis } from "@dockview/core/shared";
import { Mappable } from "../mappers/MapperProvider";
import { DockviewDockerContainer } from "./DockviewDockerContainer";
import { DockviewInstancePublicDTO } from "./DTOs/DockviewInstanceDTOs";
import { InstanceSetupInfo } from "./InstanceSetupInfo";

const idGenerator = customAlphabet("1234567890abcdefghijklmnopqrstuvxyz", 10);

export abstract class DockviewInstance implements Mappable<DockviewInstancePublicDTO> {
    private _project: ProjectQueryWithAnalysis
    private _status: ContainerStatusKey;
    private _lastAccessed: number;
    private _activeConnections: number = 0;
    private _setupInfo: InstanceSetupInfo;

    public readonly id: string;

    constructor(
        private _type: string,
        query: ProjectQueryWithAnalysis
    ) {

        console.log("Creating instance", query);
        this._project = query;
        this._status = ContainerStatus.LAUNCHING;
        this._lastAccessed = Date.now();
        this.id = idGenerator();
        this._setupInfo = new InstanceSetupInfo();
    }

    toPublicDTO(): DockviewInstancePublicDTO {

        const analysisDTO = {
            type: this.project.analysis.type,
            environment: this.project.analysis.environment,
            buildRequired: this.project.analysis.buildRequired
        }

        return {
            id: this.id,
            type: this.type,
            status: this.status,
            logs: this.logs.toPublicDTO(),
            project: {
                name: this.project.name,
                version: this.project.version,
                analysis: analysisDTO
            },
            activeConnections: this.activeConnections
        }
    }


    public get shouldAbort(): boolean {
        return this.logs.errors.length > 0;
    }

    public get isReady(): boolean {
        return this._status === ContainerStatus.TRANSITION;
    }

    public get status(): ContainerStatusKey {
        return this._status;
    }

    public set status(status: ContainerStatusKey) {
        this._status = status;
    }

    public get logs(): InstanceSetupInfo {
        return this._setupInfo;
    }

    public get type(): string {
        return this._type;
    }

    public get project(): ProjectQueryWithAnalysis {
        return this._project;
    }

    public get activeConnections(): number {
        return this._activeConnections;
    }

    public addConnection(): void {
        this._activeConnections++;
    }

    public removeConnection(): void {
        this._activeConnections--;
    }

    public updateLastAccessed(): void {
        this._lastAccessed = Date.now();
    }

    public get lastAccessed(): number {
        return this._lastAccessed;
    }

}

export class DockviewStaticInstance extends DockviewInstance {
    private _path: string;
    constructor(
        query: ProjectQueryWithAnalysis
    ) {
        super("static", query);
        this._path = query.analysis.buildDirectory;
    }

    public get path(): string {
        return this._path;
    }
}

export class DockviewServerInstance extends DockviewInstance {
    private _container: DockviewDockerContainer | null;

    constructor(
        query: ProjectQueryWithAnalysis
    ) {
        super("server", query);
        this._container = null;
    }

    public get attached(): boolean {
        return this._container !== null;
    }

    public get container(): DockviewDockerContainer | null {
        return this._container;
    }

    public attach(dockviewContainer: DockviewDockerContainer) {
        this._container = dockviewContainer;
    }
}

