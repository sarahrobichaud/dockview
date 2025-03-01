import { DockerContainer } from "@dockview/core/types";

export class DockviewDockerContainer {

    private _self: DockerContainer;

    constructor(container: DockerContainer) {
        this._self = container;
    }

    public get self(): DockerContainer {
        return this._self;
    }

    public async getNetworkInfo(): Promise<{ ip: string, port: number }> {
        const data = await this._self.inspect();
        const ports = Object.entries(data.NetworkSettings.Ports);

        const ip = data.NetworkSettings.Networks.dockview_internal.IPAddress;

        try {
            if(ports.length === 1){
                const exposedPort = ports[0][0].split("/")[0];
                return { ip, port: parseInt(exposedPort) };
            }

            const exposedPort = ports[1][0].split("/")[0];
            return { ip, port: parseInt(exposedPort) };
        } catch (e) {
            return { ip, port: 0 };
        }

    }
}