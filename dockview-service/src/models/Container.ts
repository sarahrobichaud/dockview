import {
	ContainerStatus,
	ContainerStatusKey,
} from "~/types/containerStatus.enum";

import { customAlphabet } from "nanoid";

const nanoid = customAlphabet("1234567890abcdefghijklmnopqrstuvxyz", 10);

export class DockviewContainer {
	private _status: ContainerStatusKey;
	private _lastAccessed: number;

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
	constructor(
		private port: number,
		private ip: string,
		project: string,
		version: string
	) {
		super("server", project, version);
	}
}
