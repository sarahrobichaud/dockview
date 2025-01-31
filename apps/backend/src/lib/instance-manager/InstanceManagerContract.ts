import { ProjectQuery } from "@dockview/core/shared";
import { DockviewInstance } from "~/models/Instance";

export interface InstanceManagerContract {
    register(instance: DockviewInstance): void;
    remove(instance: DockviewInstance): void;
    getByID(id: string): DockviewInstance | null;
    getExisting(query: ProjectQuery): DockviewInstance | null;
}