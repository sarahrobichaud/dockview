import { CustomEventMap, DVEventKey } from "../types/custom-event-map";
import { Instance } from "../types/events.enum";
import { WebSocketMessage } from "../types/interfaces";

export class DockviewWS extends EventTarget {
	private socket: WebSocket;

	constructor(url: string) {
		super();
		this.socket = new WebSocket(url);
		this.initialize();
	}

	public override addEventListener<T extends DVEventKey>(
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
