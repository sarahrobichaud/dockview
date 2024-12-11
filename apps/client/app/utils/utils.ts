export interface TreeNode {
  name: string;
  type: "file" | "folder";
  path: string;
  children: Array<FolderNode | FileNode>;
  level: number;
  key: string;
  isEntryPoint: boolean;
  version: number;
}

export interface FileNode extends TreeNode {
  type: "file";
  children: never[];
}

export interface FolderNode extends TreeNode {
  type: "folder";
  children: Array<FolderNode | FileNode>;
}

export interface LoadedModule extends FileNode {
  jsx?: JSX.Element | null;
  title?: string;
}

export interface ProcessedFolder extends FolderNode {
  children: Array<LoadedModule | ProcessedFolder>;
}

export default class FileTreeUtils {
  public static sortNodes(
    a: ProcessedFolder | LoadedModule,
    b: ProcessedFolder | LoadedModule
  ) {
    if (a.type < b.type) return 1;
    if (a.type > b.type) return -1;

    if (a.name < b.name) return -1;
    if (a.name > b.name) return 1;

    return 1;
  }

  public static buildFileTree(paths, entryPoint): TreeNode {
    const root = {
      name: "root",
      type: "folder",
      children: [],
      path: "/",
      version: 0,
      level: 0,
      key: "/",
      isEntryPoint: false,
    } satisfies FolderNode;

    function insertNode(parts, node, level) {
      if (parts.length === 0) return;

      const [head, ...tail] = parts;
      let childNode = node.children.find((n) => n.name === head);

      const path = `${node.path}${node.name === "root" ? "" : "/"}${head}`;
      const version = parseInt(path.split("/")[1].split("").pop() || "0");
      if (!childNode) {
        childNode = {
          name: head,
          type: tail.length === 0 ? "file" : "folder",
          children: [],
          path,
          isEntryPoint: path.replace(`/v${version}/`, "") === entryPoint,
          level: level,
          key: path,
          version,
        } satisfies TreeNode;
        node.children.push(childNode);
      }

      insertNode(tail, childNode, level + 1);
    }

    paths.forEach((path) => {
      insertNode(path.split("/"), root, 1);
    });

    return root;
  }
}
