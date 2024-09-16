"use strict";
(() => {
  // src/scripts/ws-config.js
  var ws_config_default = {
    URL_DEV: "ws://localhost:8080/",
    URL_PROD: "wss://dv.service.siteharbor.ca/ws/"
  };

  // ../dockview-ws/dist/client/index.js
  var DockviewClient = class {
    constructor(url) {
      this.socket = new WebSocket(url);
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
  var client = new DockviewClient(ws_config_default.URL_DEV);
})();
