import { DVEventKeys } from "@dockview/ws/types";
import { AppContainer } from "./container.js";
import { DockviewWSServer } from "@dockview/ws/server";

export interface WSContext {
	server: DockviewWSServer,
	container: AppContainer
}

export const registerWSHandlers = ({ server, container }: WSContext) => {

	const instanceManager = container.managers.instance;

	server.on(DVEventKeys.CLIENT_INIT, (ws, payload) => {
		console.log("CLIENT_INIT");
		console.log({ payload });
	});

	server.on(DVEventKeys.CLIENT_JOIN, (ws, payload) => {
		const container = instanceManager.getByID(payload.containerID);

		if (!container) {
			ws.close(1008, "Container not found");
			return;
		}

		server.rooms.join(ws, payload.containerID);

		container.addConnection();
	});

	server.on(DVEventKeys.CLIENT_DISCONNECT, (ws, payload) => {
		const containerID = server.rooms.getRoomByClient(ws);

		if (!containerID) {
			console.log("No container found for client");
			return;
		}

		const container = instanceManager.getByID(containerID);
		console.log({ container });

		if (!container) {
			ws.close(1008, "Container not found");
			return;
		}

		server.rooms.removeClient(ws);

		container.removeConnection();
	});
};
