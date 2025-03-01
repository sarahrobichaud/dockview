import { ContainerStatusKey } from "@dockview/core/enums";
import { DockviewInstance } from "@dockview/core/models";
import { DockviewWSServer } from "@dockview/ws/server";
import { DVEventKeys } from "@dockview/ws/types";
import type { InstanceEventEmitter } from "@dockview/core/types";

export class WSInstanceEventEmitter implements InstanceEventEmitter {

  private wsServer: DockviewWSServer;

  constructor(wsServer: DockviewWSServer) {
    this.wsServer = wsServer;
  }

  public emitLogUpdate(instance: DockviewInstance, message: string): void {
    this.wsServer.rooms.broadcast(instance.id, {
      type: DVEventKeys.UPDATE_LOG,
      payload: { log: message }
    });
  }

  public emitStatusUpdate(instance: DockviewInstance, status: ContainerStatusKey): void {

    console.log("Emitting status update for instance", instance.id, status);

    this.wsServer.rooms.broadcast(instance.id, {
      type: DVEventKeys.UPDATE_STATUS,
      payload: { 
        status,
        instance: instance.toPublicDTO()
      }
    });
  }


}