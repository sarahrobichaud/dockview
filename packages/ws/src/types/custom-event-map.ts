
export interface CustomEventMap {
    readonly "instance::update-view-count": DVUpdateViewCountEvent;
    readonly "instance::update-status": DVUpdateStatusEvent;
    readonly "instance::update-log": DVUpdateLogEvent;
    readonly "instance::join": DVJoinEvent;
    readonly "instance::disconnect": DVDisconnectEvent;

    readonly "init": DVInitEvent;
    readonly "join": DVClientJoinEvent;
    readonly "disconnect": DVClientDisconnectEvent;
}


export const DVEventKeys = {
    INIT: "instance::init",
    UPDATE_VIEW_COUNT: "instance::update-view-count",
    UPDATE_STATUS: "instance::update-status",
    UPDATE_LOG: "instance::update-log",

    CLIENT_INIT: "init",
    CLIENT_JOIN: "join",
    CLIENT_DISCONNECT: "disconnect",
} as const;

export type DVEventKey = (typeof DVEventKeys)[keyof typeof DVEventKeys];

export type DVInitEvent = CustomEvent<{ containerID: string, message: string }>;
export type DVUpdateViewCountEvent = CustomEvent<{ count: number }>;
export type DVUpdateStatusEvent = CustomEvent<{ status: string }>;
export type DVUpdateLogEvent = CustomEvent<{ log: string }>;
export type DVJoinEvent = CustomEvent<{ containerID: string }>;
export type DVDisconnectEvent = CustomEvent<{ containerID: string }>;

export type DVClientJoinEvent = { containerID: string };
export type DVClientInitEvent = { message: string, containerID: string };
export type DVClientDisconnectEvent = {};

