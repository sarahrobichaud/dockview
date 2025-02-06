import { DockviewInstance } from "@dockview/core/models";

export interface SetupServiceContract {
    setup(instance: DockviewInstance): Promise<void>;
}