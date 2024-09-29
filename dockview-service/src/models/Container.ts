import {
	ContainerStatus,
	ContainerStatusKey,
} from "~/types/containerStatus.enum";

export class DockviewContainer {
	private _status: ContainerStatusKey;
	private _lastAccessed: number;

	constructor(private _type: string) {
		this._status = ContainerStatus.LAUNCHING;
		this._lastAccessed = Date.now();
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

	public get lastAccessed(): number {
		return this._lastAccessed;
	}
}

export class DockviewStaticContainer extends DockviewContainer {
	constructor(private readonly _path: string) {
		super("static");
	}

	public get path(): string {
		return this._path;
	}
}

export class DockviewServerContainer extends DockviewContainer {
	constructor(private port: number, private ip: string) {
		super("server");
	}
}
