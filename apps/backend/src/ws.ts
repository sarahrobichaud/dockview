import { containerManager, dockviewWS } from "./server";

import { instanceHandlers } from "./ws-handlers/instance";

// dockviewWS.registerHandlers(instanceHandlers);

export const registerWSHandlers = () => {
	dockviewWS.on("init", (ws, payload) => {
		console.log({ payload });
	});

	dockviewWS.on("instance::join", (ws, payload) => {
		const container = containerManager.getContainer(payload.containerID);

		if (!container) {
			ws.close(1008, "Container not found");
			return;
		}

		dockviewWS.rooms.join(ws, payload.containerID);

		container.incrementActiveConnections();
	});

	dockviewWS.on("disconnect", (ws, payload) => {
		const containerID = dockviewWS.rooms.getRoomByClient(ws);

		if (!containerID) {
			console.log("No container found for client");
			return;
		}

		const container = containerManager.getContainer(containerID);

		if (!container) {
			ws.close(1008, "Container not found");
			return;
		}

		dockviewWS.rooms.removeClient(ws);

		container.decrementActiveConnections();
	});
};
