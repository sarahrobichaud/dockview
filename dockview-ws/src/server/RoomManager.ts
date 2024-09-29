import { WebSocket } from "ws";
import { Instance } from "../shared/events.enum";

export class RoomManager {
	private rooms: Map<string, Set<WebSocket>> = new Map();

	public joinRoom(ws: WebSocket, room: string) {
		if (!this.rooms.has(room)) {
			this.rooms.set(room, new Set());
		}
		const targetRoom = this.rooms.get(room)!;

		targetRoom.add(ws);

		this.broadcastToRoom(room, {
			type: Instance.UPDATE_VIEW_COUNT,
			payload: { count: targetRoom.size },
		});

		console.log(`Client joined room: ${room}`);
	}

	public leaveRoom(ws: WebSocket, room: string) {
		if (this.rooms.has(room)) {
			const clients = this.rooms.get(room)!;

			clients.delete(ws);

			this.broadcastToRoom(room, {
				type: Instance.UPDATE_VIEW_COUNT,
				payload: { count: clients.size },
			});
			console.log(`Client leaved room: ${room}`);

			if (clients.size === 0) {
				this.rooms.delete(room);
			}
		}
	}

	public broadcastToRoom(room: string, message: any) {
		if (this.rooms.has(room)) {
			const data = JSON.stringify(message);
			const clients = this.rooms.get(room)!;
			for (const client of clients) {
				if (client.readyState === WebSocket.OPEN) {
					client.send(data);
				}
			}
		}
	}

	public removeClient(ws: WebSocket) {
		for (const [room, clients] of this.rooms.entries()) {
			if (clients.has(ws)) {
				clients.delete(ws);

				this.broadcastToRoom(room, {
					type: Instance.UPDATE_VIEW_COUNT,
					payload: { count: clients.size },
				});
				console.log(`Client leaved room: ${room}`);
				if (clients.size === 0) {
					this.rooms.delete(room);
				}
			}
		}
	}
}
