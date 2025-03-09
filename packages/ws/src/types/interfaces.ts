import { CustomEventMap, DVEventKey } from "./custom-event-map.js";

export interface WebSocketMessage<T extends DVEventKey & keyof CustomEventMap> {
  type: T;
  payload: CustomEventMap[T];
}
