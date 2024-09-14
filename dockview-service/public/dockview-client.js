"use strict";
(() => {
  // ../dockview-ws/dist/client/index.js
  var DockviewClient = class {
    constructor(url2) {
      this.socket = new WebSocket(url2);
      this.initialize();
    }
    initialize() {
      this.socket.addEventListener("open", () => {
        console.log("Connected to server");
        this.send({ type: "init", payload: "Hello Server" });
      });
      this.socket.addEventListener("message", ({ data }) => {
        const message = JSON.parse(data.toString());
        this.handleMessage(message);
      });
      this.socket.addEventListener("close", () => {
        console.log("Disconnected from server");
      });
    }
    handleMessage(message) {
      console.log("Received message:", message);
    }
    send(message) {
      this.socket.send(JSON.stringify(message));
    }
  };

  // src/scripts/client.js
  var url = "ws://localhost:8080/";
  var client = new DockviewClient(url);
})();
