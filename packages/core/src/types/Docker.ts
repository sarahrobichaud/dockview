
export interface DockerContainer {
    id: string;

    stop(): Promise<any>;
    remove(): Promise<any>;
    start(): Promise<any>;

    inspect(): Promise<DockerContainerInspectInfo>;
}

export interface DockerContainerInspectInfo {
    Id: string;
    NetworkSettings: {
        Networks: {
            [key: string]: {
                IPAddress: string;
            };
        };
        Ports: {
            [key: string]: {
                HostIp: string;
                HostPort: string;
            }[];
        };
    };
}