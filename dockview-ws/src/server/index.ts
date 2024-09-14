import { WebSocketServer, WebSocket } from "ws";
import { WebSocketMessage } from "../shared/interfaces";

export class DockviewServer {
  private wss: WebSocketServer;

  constructor(port: number) {
    this.wss = new WebSocketServer({ port });
    this.initialize();

    console.log(`Dockview WS Server started on port ${port}`);
  }

  private initialize() {
    this.wss.on("connection", (ws: WebSocket) => {
      console.log("Client connected");

      ws.on("message", (data) => {
        const message: WebSocketMessage = JSON.parse(data.toString());
        this.handleMessage(ws, message);
      });

      ws.on("close", () => {
        console.log("Client disconnected");
      });

      // Optionally, send a welcome message
      this.send(ws, {
        type: "welcome",
        payload: "Connected to Dockview Server",
      });
    });
  }

  private handleMessage(ws: WebSocket, message: WebSocketMessage) {
    console.log("Received message:", message);
    // Implement your logic here, e.g., manage Docker container connections
  }

  public send(ws: WebSocket, message: WebSocketMessage) {
    ws.send(JSON.stringify(message));
  }
}
