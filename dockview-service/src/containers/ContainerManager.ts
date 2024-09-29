import { DockviewContainer } from "~/models/Container";

export class ContainerManager {
	constructor(
		private readonly containers: Map<string, DockviewContainer>,
		private readonly projects: Map<string, Set<string>>
	) {}

	public registerContainer(container: DockviewContainer) {
		const projectKey = this.getProjectKey(container.project, container.version);

		if (!this.projects.has(projectKey)) {
			this.projects.set(projectKey, new Set());
		}

		this.projects.get(projectKey)!.add(container.id);

		this.containers.set(container.id, container);

		if (process.env.NODE_ENV === "development") {
			setInterval(() => {
				console.log({
					projectCount: this.projects.size,
					containerCount: this.containers.size,
				});
			}, 1000);
		}
	}

	public unregisterContainer(container: DockviewContainer) {
		this.containers.delete(container.id);
	}

	public getContainer(containerID: string) {
		return this.containers.get(containerID);
	}

	public getExistingInstance(projectName: string, version: string) {
		const projectKey = this.getProjectKey(projectName, version);

		if (!this.projects.has(projectKey)) {
			return null;
		}

		const existingIDs = this.projects.get(projectKey);

		if (!existingIDs) {
			return null;
		}

		// Return the first instance
		// TODO: Could implement load balancing here
		const instance = this.containers.get(Array.from(existingIDs)[0]);

		return instance ?? null;
	}

	public getProjectKey(projectName: string, version: string) {
		return `${projectName}::${version}`;
	}
}
