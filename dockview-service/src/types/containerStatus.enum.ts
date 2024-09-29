import { CANCELLED } from "dns";

export const ContainerStatus = {
	LAUNCHING: "Getting Things Ready",
	BUILD_IMAGE: "Creating Image",
	SPIN_UP: "Spinning up container",
	ERROR: "An error occured",
	READY: "Container is ready",
	CANCELLED: "Aborting..",
	TRANSITION: "ready",
} as const;

export type ContainerStatusKey =
	(typeof ContainerStatus)[keyof typeof ContainerStatus];
