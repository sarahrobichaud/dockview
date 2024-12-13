export const Instance = {
	JOIN: "instance::join",
	LEAVE: "instance::leave",
	UPDATE_VIEW_COUNT: "instance::updateViewCount",
} as const;

export type InstanceEventKey = (typeof Instance)[keyof typeof Instance];

export const WSEvent = {
	OPEN: "open",
	CLOSE: "close",
} as const;

export type WSEventKey = (typeof WSEvent)[keyof typeof WSEvent];
