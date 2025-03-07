export interface TreeNode {
    name: string;
    type: "file" | "folder";
    path: string;
    children: Array<FolderNode | FileNode>;
    level: number;
    key: string;
}

export interface FileNode extends TreeNode {
    type: "file";
    children: never[];
}

export interface FolderNode extends TreeNode {
    type: "folder";
    children: Array<FolderNode | FileNode>;
}


export interface ProcessedFolder extends FolderNode {
    children: Array<ProcessedFolder>;
}

export default class FileTreeBuilder {
    public static sortNodes(
        a: FolderNode | FileNode,
        b: FolderNode | FileNode
    ) {
        if (a.type < b.type) return 1;
        if (a.type > b.type) return -1;

        if (a.name < b.name) return -1;
        if (a.name > b.name) return 1;

        return 1;
    }

    public static buildFileTree(paths: string[]): TreeNode {
        const root = {
            name: "root",
            type: "folder",
            children: [],
            path: "/",
            level: 0,
            key: "/",
        } satisfies FolderNode;

        function insertNode(parts: string[], node: TreeNode, level: number) {
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
                    level: level,
                    key: path,
                } satisfies TreeNode;
                node.children.push(childNode!);
            }

            insertNode(tail, childNode!, level + 1);
        }

        paths.forEach((path) => {
            insertNode(path.split("/"), root, 1);
        });

        return root;
    }
}