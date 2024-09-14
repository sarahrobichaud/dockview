import React from "react";
import type { LoadedModule, ProcessedFolder } from "../../utils/utils";
import FileNode from "./FileNode";

export type DirectoryContentsProps = {
  nodes: (ProcessedFolder | LoadedModule)[];
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
