import { FileNode as FileNodeType, FolderNode } from "~/lib/filetree-builder/filetree.js";
import FileNode from "./FileNode.js";

export type DirectoryContentsProps = {
  nodes: (FolderNode | FileNodeType)[];
  spacing: number;
};
export default function DirectoryContents({
  nodes,
  spacing,
}: DirectoryContentsProps) {
  return (
    <ul className="list-none w-full">
      {nodes.map((node) => {
        return <FileNode key={node.path} node={node} spacing={spacing} />;
      })}
    </ul>
  );
}
