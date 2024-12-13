
export interface CustomEventMap  {
    readonly "instance::init": DVInitEvent;
    readonly "instance::update-view-count": DVUpdateViewCountEvent;
} 


export const DVEventKeys  = {
    INIT: "instance::init",
    UPDATE_VIEW_COUNT: "instance::update-view-count",
} as const;

export type DVEventKey =(typeof DVEventKeys)[keyof typeof DVEventKeys]; 


export type DVInitEvent = CustomEvent<{ containerID: string }>;
export type DVUpdateViewCountEvent = CustomEvent<{ count: number }>;
