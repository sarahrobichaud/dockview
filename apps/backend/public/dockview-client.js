"use strict";
(() => {
  // src/scripts/ws-config.ts
  var ws_config_default = {
    URL_DEV: "ws://localhost:8080/",
    URL_PROD: "wss://dv.service.siteharbor.ca/ws/"
  };

  // ../../packages/ws/src/types/events.enum.ts
  var Instance = {
    JOIN: "instance::join",
    LEAVE: "instance::leave",
    UPDATE_VIEW_COUNT: "instance::updateViewCount"
  };

  // ../../packages/ws/src/client/index.ts
  var DockviewWS = class extends EventTarget {
    constructor(url) {
      super();
      this.socket = new WebSocket(url);
      this.initialize();
    }
    // Implementation
    addEventListener(type, listener, options) {
      super.addEventListener(type, listener, options);
    }
    initialize() {
      this.socket.addEventListener("open", () => {
        console.log("Connected to server");
        this.dispatchEvent(new Event("open"));
        const subdomain = window.location.hostname.split(".")[0];
        const [prefix, containerID] = subdomain.split("--");
        this.send({ type: Instance.JOIN, payload: { containerID } });
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
    handleMessage(message) {
      const event = new CustomEvent(message.type, { detail: message.payload });
      this.dispatchEvent(event);
    }
    send(message) {
      this.socket.send(JSON.stringify(message));
    }
  };

  // ../../packages/ws/src/types/custom-event-map.ts
  var DVEventKeys = {
    INIT: "instance::init",
    UPDATE_VIEW_COUNT: "instance::update-view-count"
  };

  // src/scripts/client.ts
  var client = new DockviewWS(ws_config_default.URL_DEV);
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
})();
//# sourceMappingURL=dockview-client.js.map
