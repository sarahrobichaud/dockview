import React from "react";
import type { LoadedModule, ProcessedFolder } from "../../utils/utils";

import { useState } from "react";
import { File, FolderOpen, FolderClosed } from "lucide-react";
import clsx from "clsx";
import DirectoryContents from "./DirectoryContents";
import FileTreeUtils from "../../utils/utils";
import { useDockview } from "../../contexts/DockviewContext.tsx";

export default function FileNode({
  node,
  spacing,
}: {
  node: ProcessedFolder | LoadedModule;
  spacing: number;
}) {
  const { selectFile, activeFile } = useDockview();
  const [expanded, setExpanded] = useState(false);
  const icon =
    node.type === "file" ? (
      <File />
    ) : expanded ? (
      <FolderOpen />
    ) : (
      <FolderClosed />
    );

  function expandDirectory() {
    if (node.type !== "folder") return;
    setExpanded((prev) => !prev);
  }

  const adjustedLevel = node.level - 1;
  const opened = activeFile?.path === node.path || false;

  const baseSpacing = 16;
  const leftPadding =
    adjustedLevel === 1 ? baseSpacing : baseSpacing + adjustedLevel * spacing;

  return (
    <li
      style={{
        maxWidth: "calc(100% - 2px)",
      }}
      className={clsx("ml-0 font-size", {})}
    >
      <button
        style={{
          paddingLeft: `${leftPadding}px`,
          paddingRight: `-${leftPadding}px`,
          maxWidth: "calc(100% - 2px)",
        }}
        className={clsx(
          "w-full flex gap-2 items-center hover:bg-gray-300 py-1",
          {
            "font-bold": node.type === "folder",
            "!font-bold !bg-charcoal !text-white": opened,
          }
        )}
        onClick={
          node.type === "folder"
            ? expandDirectory
            : () => selectFile(opened ? null : node)
        }
      >
        {icon}
        {node.name}
        <span className="opacity-60 font-normal">V{node.version}</span>
      </button>
      {expanded && (
        <DirectoryContents
          nodes={node.children.sort(FileTreeUtils.sortNodes)}
          spacing={spacing}
        />
      )}
    </li>
  );
}
