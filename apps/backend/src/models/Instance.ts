import {
	ContainerStatus,
	ContainerStatusKey,
} from "~/types/containerStatus.enum";

import { customAlphabet } from "nanoid";
import { Container } from "dockerode";
import { ProjectQueryWithAnalysis } from "@dockview/core/shared";

const nanoid = customAlphabet("1234567890abcdefghijklmnopqrstuvxyz", 10);

export type InstanceSetupEventType = "error" | "warning" | "info" | "event";

export class InstanceSetupEvent extends Error {
	private _reason: string;
	private _type: InstanceSetupEventType;
	private _timestamp: string;

	constructor(message: string, reason?: string, type: InstanceSetupEventType = "event") {
		super(message);
		this._reason = reason ?? "";
		this._type = type;
		this._timestamp = new Date().toISOString();
	}

	public get reason(): string {
		return this._reason;
	}

	public get type(): InstanceSetupEventType {
		return this._type;
	}

	public get message(): string {
		return this.message;
	}

	public override toString(): string {
		return `[Dockview ${this._timestamp}] ${this._type}: ${this.message}`
	}

	public get timestamp(): string {
		return this._timestamp;
	}
}


export class InstanceSetupInfo {
	private _events: InstanceSetupEvent[] = [];

	private _currentStep: string | null = null;

	/**
	 * Sorted events by timestamp
	 */
	public get events(): readonly InstanceSetupEvent[] {
		return Object.freeze([...this._events.sort((a, b) => a.timestamp.localeCompare(b.timestamp))]);
	}

	/**
	 * Sorted errors by timestamp
	 */
	public get errors(): readonly InstanceSetupEvent[] {
		return Object.freeze([...this.events.filter(e => e.type === 'error')]);
	}

	/**
	 * Sorted warnings by timestamp
	 */
	public get warnings(): readonly InstanceSetupEvent[] {
		return Object.freeze([...this.events.filter(e => e.type === 'warning')]);
	}

	/**
	 * Sorted info by timestamp
	 */
	public get info(): readonly InstanceSetupEvent[] {
		return Object.freeze([...this.events.filter(e => e.type === 'info')]);
	}

	/**
	 * The last event message
	 */
	public get currentStep(): string | null {
		return this.info[this.info.length - 1].message ?? null;
	}

	public logEvent(message: string, reason?: string): void {
		console.log("logEvent", message, reason);
		this._events.push(new InstanceSetupEvent(message, reason, 'event'));
	}

	public logError(message: string, reason?: string): void {
		console.log("logError", message, reason);
		this._events.push(new InstanceSetupEvent(message, reason, 'error'));
	}

	public logWarning(message: string, reason?: string): void {
		console.log("logWarning", message, reason);
		this._events.push(new InstanceSetupEvent(message, reason, 'warning'));
	}

	public logInfo(message: string, reason?: string): void {
		console.log("logInfo", message, reason);
		this._events.push(new InstanceSetupEvent(message, reason, 'info'));
	}
}

export abstract class DockviewInstance {
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
		this.id = nanoid();
		this._setupInfo = new InstanceSetupInfo();
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


export class DockviewDockerContainer {

	private _self: Container;

	constructor(container: Container) {
		this._self = container;
	}

	public get self(): Container {
		return this._self;
	}

	public async getNetworkInfo(): Promise<{ip: string, port: number}> {
		const data = await this._self.inspect();
		const ports = Object.entries(data.NetworkSettings.Ports);

		const ip = data.NetworkSettings.Networks.dockview_internal.IPAddress;

		const exposedPort = ports[1][0].split("/")[0];

		return {ip, port: parseInt(exposedPort)};
	}
}