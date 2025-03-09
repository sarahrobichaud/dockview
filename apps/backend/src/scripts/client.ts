import { DockviewWS } from "@dockview/ws/client";
import { DVEventKeys } from "@dockview/ws/types";
import React from 'react';
import ReactDOM from 'react-dom/client';
import { InstanceView } from '../views/jsx/Instance.js';
import WSConfig from "./ws-config.js";
import { ContainerStatus } from "@dockview/core/enums";

const client = new DockviewWS(WSConfig.URL_DEV);

client.addEventListener(DVEventKeys.INIT, (event) => {
	console.log(event.detail.message);
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


	if (event.detail.status === ContainerStatus.TRANSITION) {
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

declare global {
	interface Window {
		__INITIAL_STATE__: Record<string, any>;
	}
}

// Component registry
const COMPONENTS: Record<string, React.ComponentType<any>> = {
	'instance-view': InstanceView,
};

// Hydrate components when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
	console.log('Dockview client hydration initializing');

	const initialState = window.__INITIAL_STATE__ || {};

	const hydrateElements = document.querySelectorAll('[data-hydrate-id]');

	if (hydrateElements.length === 0) {
		console.log('No components found for hydration');
	}

	hydrateElements.forEach(element => {
		const id = element.getAttribute('data-hydrate-id');
		const propsJson = element.getAttribute('data-hydrate-props');

		if (!id || !propsJson) {
			console.warn('Missing hydration data');
			return;
		}

		const Component = COMPONENTS[id];

		if (!Component) {
			console.warn(`Component not found for hydration: ${id}`);
			return;
		}

		try {
			// Parse the props
			const props = JSON.parse(propsJson);

			const mergedProps = {
				...props,
				initialState,
			};

			ReactDOM.createRoot(element).render(
				React.createElement(Component, mergedProps),
			);

			console.log(`Hydrated component: ${id}`);
		} catch (error) {
			console.error(`Error hydrating component ${id}:`, error);
		}
	});

});