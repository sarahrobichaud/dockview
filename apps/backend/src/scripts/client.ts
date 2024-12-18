import WSConfig from "./ws-config";
import { Instance } from "../types/events.enum";
import { DockviewWS } from "@dockview/ws/client";
import {DVEventKey, DVEventKeys} from "@dockview/ws/types"

const client = new DockviewWS(WSConfig.URL_DEV);

client.addEventListener(DVEventKeys.INIT, (event) => {
	console.log(event.detail);
});


client.addEventListener(DVEventKeys.UPDATE_VIEW_COUNT, (event) => {
	const viewCount = document.getElementById("view-count");

	if (!viewCount) {
		console.log("view-count not found");
		return;
	}

	viewCount.classList.remove("animate-spin");
	viewCount.innerHTML = event.detail.count.toString();
});
