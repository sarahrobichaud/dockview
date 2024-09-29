import { Instance } from "../shared/events.enum";
import { WebSocketMessage } from "../shared/interfaces";

export class DockviewWS extends EventTarget {
	private socket: WebSocket;

	constructor(url: string) {
		super();
		this.socket = new WebSocket(url);
		this.initialize();
	}

	private initialize() {
		this.socket.addEventListener("open", () => {
			console.log("Connected to server");
			// Optionally, send an initial message
			this.dispatchEvent(new Event("open"));

			// Extract containerID from subdomain

			const subdomain = window.location.hostname.split(".")[0];

			const [prefix, containerID] = subdomain.split("--");

			this.send({ type: Instance.JOIN, payload: { containerID: containerID } });
		});

		this.socket.addEventListener("message", ({ data }) => {
			const message: WebSocketMessage = JSON.parse(data.toString());
			this.handleMessage(message);
		});

		this.socket.addEventListener("close", () => {
			this.dispatchEvent(new Event("close"));
			console.log("Disconnected from server");
		});
	}

	private handleMessage(message: WebSocketMessage) {
		const event = new CustomEvent(message.type, { detail: message.payload });
		this.dispatchEvent(event);
	}

	public send(message: WebSocketMessage) {
		this.socket.send(JSON.stringify(message));
	}
}
