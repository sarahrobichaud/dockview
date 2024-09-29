import { dockviewWS } from "./server";

export const registerWSHandlers = () => {
	dockviewWS.on("init", (ws, payload) => {
		console.log({ payload });
	});
};
