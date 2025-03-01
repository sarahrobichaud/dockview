export const ContainerStatus = {
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
	ABORTED: "Aborted",
} as const;

export type ContainerStatusKey =
	(typeof ContainerStatus)[keyof typeof ContainerStatus];
