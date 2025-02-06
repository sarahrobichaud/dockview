import { ProjectQuery, ProjectQueryWithAnalysis } from "@dockview/core/shared";
import { DockviewInstance } from "@dockview/core/models";


export interface InstanceManagerContract {
    register(instance: DockviewInstance): void;
    remove(instance: DockviewInstance): void;
    getByID(id: string): DockviewInstance | null;
    getExisting(query: ProjectQuery): DockviewInstance | null;

    createDockviewInstance(query: ProjectQueryWithAnalysis): DockviewInstance
}