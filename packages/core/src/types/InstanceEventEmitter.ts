import { ContainerStatusKey } from "../enums/index.js";
import { DockviewInstance } from "../model/index.js";

export interface InstanceEventEmitter {
  emitStatusUpdate(instance: DockviewInstance, status: ContainerStatusKey): void;
  emitLogUpdate(instance: DockviewInstance, message: string): void;
}