import { container } from "tsyringe";
import { InstanceManagerContract } from "./lib/instance-manager/InstanceManagerContract";
import { dockviewWS } from "./server";
import { TOKENS } from "./tokens";
import { Instance } from "node_modules/@dockview/ws/src/types/events.enum";


export const registerWSHandlers = () => {

	const instanceManager = container.resolve<InstanceManagerContract>(TOKENS.InstanceManager);

	dockviewWS.on("init", (ws, payload) => {
		console.log({ payload });
	});

	dockviewWS.on("instance::join", (ws, payload) => {
		const container = instanceManager.getByID(payload.containerID);
		console.log({ instanceManager });
		console.log({ container });

		if (!container) {
			ws.close(1008, "Container not found");
			return;
		}

		dockviewWS.rooms.join(ws, payload.containerID);

		container.addConnection();
	});

	dockviewWS.on("disconnect", (ws, payload) => {
		const containerID = dockviewWS.rooms.getRoomByClient(ws);

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

		dockviewWS.rooms.removeClient(ws);

		container.removeConnection();
	});
};
