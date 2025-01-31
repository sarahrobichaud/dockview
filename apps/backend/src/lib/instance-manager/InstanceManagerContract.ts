import { ProjectQuery, ProjectQueryWithAnalysis } from "@dockview/core/shared";
import { DockviewInstance } from "~/models/Instance";

export interface onDestroy {
    onDestroy(): Promise<void>;
}

export interface InstanceManagerContract extends onDestroy {
    register(instance: DockviewInstance): void;
    remove(instance: DockviewInstance): void;
    getByID(id: string): DockviewInstance | null;
    getExisting(query: ProjectQuery): DockviewInstance | null;

    createDockviewInstance(query: ProjectQueryWithAnalysis): DockviewInstance
}