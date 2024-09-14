import { WebSocketMessage } from "../shared/interfaces";

export class DockviewClient {
  private socket: WebSocket;

  constructor(url: string) {
    this.socket = new WebSocket(url);
    this.initialize();
  }

  private initialize() {
    this.socket.addEventListener("open", () => {
      console.log("Connected to server");
      // Optionally, send an initial message
      this.send({ type: "init", payload: "Hello Server" });
    });

    this.socket.addEventListener("message", ({ data }) => {
      const message: WebSocketMessage = JSON.parse(data.toString());
      this.handleMessage(message);
    });

    this.socket.addEventListener("close", () => {
      console.log("Disconnected from server");
    });
  }

  private handleMessage(message: WebSocketMessage) {
    console.log("Received message:", message);

    // Implement your logic here
  }

  public send(message: WebSocketMessage) {
    this.socket.send(JSON.stringify(message));
  }
}
