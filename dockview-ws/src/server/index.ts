import { WebSocketServer, WebSocket } from "ws";
import { WebSocketMessage } from "../shared/interfaces";
import { EventEmitter } from "events";
import { RoomManager } from "./RoomManager";
import { Instance } from "../shared/events.enum";

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

	private initialize() {
		this.wss.on("connection", (ws: WebSocket) => {
			console.log("Client connected");

			this.clients.add(ws);
			this.eventEmitter.emit("connect", ws);

			ws.on("message", (data) => {
				const message: WebSocketMessage = JSON.parse(data.toString());
				this.handleMessage(ws, message);
			});

			ws.on("close", () => {
				console.log("Client disconnected");
				this.clients.delete(ws);
				this.eventEmitter.emit("disconnect", ws);
			});

			// Optionally, send a welcome message
			this.send(ws, {
				type: "init",
				payload: "Connected to Dockview Server",
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

	private handleMessage(ws: WebSocket, message: WebSocketMessage) {
		console.log("Received message:", message);
		// Implement your logic here, e.g., manage Docker container connections
		this.eventEmitter.emit(message.type, ws, message.payload);
	}

	public send(ws: WebSocket, message: WebSocketMessage) {
		ws.send(JSON.stringify(message));
	}

	public broadcast(message: WebSocketMessage) {
		const data = JSON.stringify(message);
		this.clients.forEach((client) => {
			if (client.readyState === WebSocket.OPEN) {
				client.send(data);
			}
		});
	}

	public on(
		eventType: string,
		listener: (ws: WebSocket, payload: any) => void
	) {
		this.eventEmitter.on(eventType, listener);
	}
}
