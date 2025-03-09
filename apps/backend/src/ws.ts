import { container } from "tsyringe";
import { InstanceManagerContract } from "./lib/instance-manager/InstanceManagerContract";
import { Instance } from "node_modules/@dockview/ws/src/types/events.enum";
import { AppContext } from "./infrastructure/BaseRouter";
import { DockviewWSServer } from "@dockview/ws/server";
import { AppContainer } from "./container";

export interface WSContext {
	server: DockviewWSServer,
	container: AppContainer
}

export const registerWSHandlers = ({ server, container }: WSContext) => {

	const instanceManager = container.managers.instance;

	server.on("init", (ws, payload) => {
		console.log({ payload });
	});

	server.on("instance::join", (ws, payload) => {
		const container = instanceManager.getByID(payload.containerID);

		if (!container) {
			ws.close(1008, "Container not found");
			return;
		}

		server.rooms.join(ws, payload.containerID);

		container.addConnection();
	});

	server.on("disconnect", (ws, payload) => {
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
