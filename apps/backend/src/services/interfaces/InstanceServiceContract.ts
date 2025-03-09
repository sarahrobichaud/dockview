import { InstanceRequestResponse } from "@dockview/core/api/responses";
import { ProjectAnalysis, ProjectQuery, ProjectQueryWithAnalysis } from "@dockview/core/shared";
import { DockviewInstance } from "@dockview/core/models";
import { FileNode, FolderNode, TreeNode } from "~/lib/filetree-builder/filetree.js";

export interface InstanceServiceContract {
    request(query: ProjectQueryWithAnalysis): Promise<InstanceRequestResponse>;
    getByID(id: string): DockviewInstance;
    getFiles(instance: DockviewInstance): (FolderNode | FileNode)[];
}