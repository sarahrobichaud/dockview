import type { WebSocket } from "ws";
import { containerManager, dockviewWS } from "~/server";

export const instanceHandlers = {
	"instance::init": (ws, payload) => {
		console.log("initHandler", payload);
	},

	"instance::join": (ws, payload) => {
		const container = containerManager.getContainer(payload.containerID);

		if (!container) {
			ws.close(1008, "Container not found");
			return;
		}

		dockviewWS.rooms.join(ws, payload.containerID);

		container.incrementActiveConnections();
	},

	"instance::leave": (ws, payload) => {
		const container = containerManager.getContainer(payload.containerID);

		if (!container) {
			ws.close(1008, "Container not found");
			return;
		}

		container.decrementActiveConnections();
		dockviewWS.rooms.leave(ws, payload.containerID);
	},
} as { [key: string]: (ws: WebSocket, payload: any) => void };
