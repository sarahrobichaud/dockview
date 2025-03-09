import { CustomEventMap, DVEventKey, DVEventKeys } from "~/types/custom-event-map.js";
import { WebSocketMessage } from "~/types/interfaces.js";

export class DockviewWS extends EventTarget {
	private socket: WebSocket;

	constructor(url: string) {
		super();
		this.socket = new WebSocket(url);
		this.initialize();
	}

	public override addEventListener<T extends keyof CustomEventMap>(
		type: T,
		listener: (event: CustomEventMap[T]) => void,
		options?: boolean | AddEventListenerOptions
	): void
	// Second overload matching EventTarget's signature exactly
	public override addEventListener(
		type: string,
		listener: EventListenerOrEventListenerObject | null,
		options?: boolean | AddEventListenerOptions
	): void;
	// Implementation
	public override addEventListener(
		type: string,
		listener: EventListenerOrEventListenerObject | null,
		options?: boolean | AddEventListenerOptions
	): void {
		super.addEventListener(type, listener, options);
	}


	private initialize() {
		this.socket.addEventListener("open", () => {
			this.dispatchEvent(new Event("open"));

			// Extract containerID from subdomain
			const subdomain = window.location.hostname.split(".")[0];

			let containerID: string | null = null;

			if (subdomain === 'monitor') {
				// Get the id from first param
				containerID = window.location.pathname.split("/")[1];
			} else {
				containerID = subdomain.split("--")[1];
			}

			console.log({ init: { containerID } });

			this.send({ type: DVEventKeys.CLIENT_JOIN, payload: { containerID } });
		});

		this.socket.addEventListener("message", ({ data }) => {
			const message = JSON.parse(data.toString());
			this.handleMessage(message);
		});

		this.socket.addEventListener("close", () => {
			this.dispatchEvent(new Event("close"));
			console.log("Disconnected from server");
		});
	}

	private handleMessage<T extends keyof CustomEventMap & DVEventKey>(message: WebSocketMessage<T>) {
		const event = new CustomEvent(message.type, { detail: message.payload });
		this.dispatchEvent(event);
	}

	public send<T extends keyof CustomEventMap>(message: CustomEventMap[T]) {
		this.socket.send(JSON.stringify(message));
	}
}
