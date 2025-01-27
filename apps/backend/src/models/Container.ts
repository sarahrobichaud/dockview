import {
	ContainerStatus,
	ContainerStatusKey,
} from "~/types/containerStatus.enum";

import { customAlphabet } from "nanoid";
import { Container } from "dockerode";
import { DockviewDockerContainer } from "~/containers/docker/docker-utils";

const nanoid = customAlphabet("1234567890abcdefghijklmnopqrstuvxyz", 10);

export class DockviewContainer {
	private _status: ContainerStatusKey;
	private _lastAccessed: number;
	private _activeConnections: number = 0;

	public readonly id: string;

	constructor(
		private _type: string,
		private _project: string,
		private _version: string
	) {
		this._status = ContainerStatus.LAUNCHING;
		this._lastAccessed = Date.now();
		this.id = nanoid();
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

	public get type(): string {
		return this._type;
	}

	public get project(): string {
		return this._project;
	}

	public get version(): string {
		return this._version;
	}

	public get activeConnections(): number {
		return this._activeConnections;
	}

	public incrementActiveConnections(): void {
		this._activeConnections++;
	}

	public decrementActiveConnections(): void {
		this._activeConnections--;
	}

	public updateLastAccessed(): void {
		this._lastAccessed = Date.now();
	}

	public get lastAccessed(): number {
		return this._lastAccessed;
	}
}

export class DockviewStaticContainer extends DockviewContainer {
	constructor(
		private readonly _path: string,
		project: string,
		version: string
	) {
		super("static", project, version);
	}

	public get path(): string {
		return this._path;
	}
}

export class DockviewServerContainer extends DockviewContainer {
	private _ip: string | null;
	private _port: number | null;
	private _instance: Container | null;

	constructor(
		project: string,
		version: string
	) {
		super("server", project, version);
		this._ip = null;
		this._port = null;
		this._instance = null;
	}

	public get attached(): boolean {
		return this._ip !== null && this._port !== null && this._instance !== null;
	}

	public get ip(): string | null {
		return this._ip;
	}

	public get port(): number | null {
		return this._port;
	}

	public get instance(): Container | null {
		return this._instance;
	}

	public attach(dockviewContainer: DockviewDockerContainer) {
		console.log("Attaching server container", dockviewContainer);
		this._ip = dockviewContainer.ip
		this._port = dockviewContainer.port;
		this._instance = dockviewContainer.self;
	}
}
