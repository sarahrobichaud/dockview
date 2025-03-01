"use strict";
(() => {
  // ../../packages/core/src/enums/containerStatus.enum.ts
  var ContainerStatus = {
    CREATING_DOCKERFILE: "Creating Dockerfile",
    CREATING_IMAGE: "Creating Image",
    BUILDING_IMAGE: "Building Image",
    LAUNCHING: "Getting Things Ready",
    SPIN_UP: "Spinning up container",
    STARTED: "Container started",
    READY: "Container is ready",
    TRANSITION: "Instance is ready",
    ERROR: "An error occured",
    CANCELLED: "Aborting..",
    ABORTED: "Aborted"
  };

  // src/scripts/ws-config.ts
  var ws_config_default = {
    URL_DEV: "ws://localhost:8080/",
    URL_PROD: "wss://dv.service.siteharbor.ca/ws/"
  };

  // ../../packages/ws/src/types/events.enum.ts
  var Instance = {
    JOIN: "instance::join",
    LEAVE: "instance::leave",
    UPDATE_VIEW_COUNT: "instance::updateViewCount",
    UPDATE_STATUS: "instance::updateStatus"
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
        this.dispatchEvent(new Event("open"));
        const subdomain = window.location.hostname.split(".")[0];
        let containerID = null;
        if (subdomain === "monitor") {
          containerID = window.location.pathname.split("/")[1];
        } else {
          containerID = subdomain.split("--")[1];
        }
        console.log({ init: { containerID } });
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
    UPDATE_VIEW_COUNT: "instance::update-view-count",
    UPDATE_STATUS: "instance::update-status",
    UPDATE_LOG: "instance::update-log"
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
        location.reload();
      }, 1e3);
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
})();
//# sourceMappingURL=dockview-client.js.map
