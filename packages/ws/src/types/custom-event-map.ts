
export interface CustomEventMap  {
    readonly "instance::init": DVInitEvent;
    readonly "instance::update-view-count": DVUpdateViewCountEvent;
    readonly "instance::update-status": DVUpdateStatusEvent;
    readonly "instance::update-log": DVUpdateLogEvent;
} 

export const DVEventKeys  = {
    INIT: "instance::init",
    UPDATE_VIEW_COUNT: "instance::update-view-count",
    UPDATE_STATUS: "instance::update-status",
    UPDATE_LOG: "instance::update-log",
} as const;

export type DVEventKey =(typeof DVEventKeys)[keyof typeof DVEventKeys]; 

export type DVInitEvent = CustomEvent<{ containerID: string }>;
export type DVUpdateViewCountEvent = CustomEvent<{ count: number }>;
export type DVUpdateStatusEvent = CustomEvent<{ status: string }>;
export type DVUpdateLogEvent = CustomEvent<{ log: string }>;