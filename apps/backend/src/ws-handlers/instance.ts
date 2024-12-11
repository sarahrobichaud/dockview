import { WebSocketMessage } from "dockview-ws/dist/shared/interfaces";
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
} as { [key: string]: (ws: WebSocket, payload: any) => void };
