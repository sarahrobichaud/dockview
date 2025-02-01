import { DockviewInstance } from "~/models/Instance";

export interface SetupServiceContract {
    setup(instance: DockviewInstance):Promise<void>;
}