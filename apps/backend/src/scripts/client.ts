import { ContainerStatus } from "@dockview/core/enums";
import WSConfig from "./ws-config";
import { DockviewWS } from "@dockview/ws/client";
import { DVEventKeys} from "@dockview/ws/types"

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

client.addEventListener(DVEventKeys.UPDATE_STATUS, (event) => {
	console.log("UPDATE_STATUS");
	console.log(event.detail.status);

	const status = document.getElementById("instance-status");
	if (!status) {
		console.log("status not found");
		return;
	}

	status.innerHTML = event.detail.status;


	if(event.detail.status === ContainerStatus.TRANSITION) {
		setTimeout(() => {
			status.classList.add("animate-spin");
			// reload the page
			location.reload();
		}, 1000);
	} else {
		status.classList.remove("animate-spin");
	}

});

client.addEventListener(DVEventKeys.UPDATE_LOG, (event) => {
	console.log("UPDATE_LOG");
	console.log(event.detail.log);

	const log = document.getElementById("instance-log");
	if (!log) {
		console.log("log not found");
		return;
	}

	log.innerHTML += event.detail.log + "\n";
	log.scrollTop = log.scrollHeight;
});
