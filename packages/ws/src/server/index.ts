import { WebSocketServer, WebSocket } from "ws";
import { WebSocketMessage } from "~/types/interfaces.js";
import { EventEmitter } from "events";
import { RoomManager } from "~/server/RoomManager.js";
import { CustomEventMap, DVEventKey, DVEventKeys } from "~/types/custom-event-map.js";

type WebSocketHandler = (ws: WebSocket, payload: any) => void;

export type WebSocketHandlers = {
	[key: string]: WebSocketHandler | { [key: string]: WebSocketHandler };
};

export class DockviewWSServer {
	private wss: WebSocketServer;
	private eventEmitter: EventEmitter;

	private clients: Set<WebSocket> = new Set();
	public readonly rooms: RoomManager;

	constructor(port: number, roomManager: RoomManager) {
		this.wss = new WebSocketServer({ port });
		this.eventEmitter = new EventEmitter();
		this.rooms = roomManager;
		this.initialize();
		console.log(`Dockview WS Server started on port ${port}`);
	}

	public static create(port: number, roomManager: RoomManager | null = null) {
		const roomMgr = roomManager ?? new RoomManager();

		const instance = new DockviewWSServer(port, roomMgr);

		return instance;
	}

	public registerHandlers(handlers: WebSocketHandlers) {
		// Recursively add on event for all keys in
		for (const [key, value] of Object.entries(handlers)) {
			if (typeof value === "function") {
				this.on(key as keyof CustomEventMap, value);
			} else {
				for (const [subKey, handler] of Object.entries(value)) {
					this.on(`${key}::${subKey}` as keyof CustomEventMap, handler);
				}
			}
		}
	}

	private initialize() {
		this.wss.on("connection", (ws: WebSocket) => {
			console.log("Client connected");

			this.clients.add(ws);
			this.eventEmitter.emit("connect", ws);

			ws.on("message", (data) => {
				const message = JSON.parse(data.toString());
				this.handleMessage(ws, message);
			});

			ws.on("close", () => {
				console.log("Client disconnected");
				this.clients.delete(ws);
				this.eventEmitter.emit("disconnect", ws);
			});

			this.send(ws, {
				type: DVEventKeys.INIT,
				payload: { message: "Connected to Dockview Server" }
			});
		});
	}

	public joinRoom(ws: WebSocket, containerID: unknown) {
		if (!containerID || typeof containerID !== "string") {
			ws.close(1008, "Instance ID required");
			return;
		}

		this.rooms.join(ws, containerID);
	}

	private handleMessage<T extends DVEventKey & keyof CustomEventMap>(ws: WebSocket, message: WebSocketMessage<T>) {
		console.log("Received message:", message);
		this.eventEmitter.emit(message.type, ws, message.payload);
	}

	public send<T extends keyof CustomEventMap>(ws: WebSocket, message: CustomEventMap[T]) {
		ws.send(JSON.stringify(message));
	}

	public broadcast<T extends keyof CustomEventMap>(message: CustomEventMap[T]) {
		const data = JSON.stringify(message);
		this.clients.forEach((client) => {
			if (client.readyState === WebSocket.OPEN) {
				client.send(data);
			}
		});
	}

	public on<T extends keyof CustomEventMap>(
		eventType: T,
		listener: (ws: WebSocket, payload: CustomEventMap[T]) => void
	) {
		this.eventEmitter.on(eventType, listener);
	}
}
