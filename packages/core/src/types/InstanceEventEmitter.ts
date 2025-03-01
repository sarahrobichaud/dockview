import { ContainerStatusKey } from "../enums";
import { DockviewInstance } from "../model";

export interface InstanceEventEmitter {
  emitStatusUpdate(instance: DockviewInstance, status: ContainerStatusKey): void;
  emitLogUpdate(instance: DockviewInstance, message: string): void;
}