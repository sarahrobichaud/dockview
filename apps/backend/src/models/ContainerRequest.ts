import { DockviewConfig } from "dockview";

export interface ContainerRequest {
  project: string;
  version: string;
  buildPath: string;
  sourcePath: string;
  projectType: string;
  settings: {
    provided: DockviewConfig;
    buildRequired: boolean;
  };
  availableModes: string[];
}
