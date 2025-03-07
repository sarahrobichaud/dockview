import React from "react";

import { useState } from "react";
import { File, FolderOpen, FolderClosed } from "@dockview/ui/icons";
import clsx from "clsx";
import DirectoryContents from "./DirectoryContents";
import { FolderNode, FileNode as FileNodeType } from "~/lib/filetree-builder/filetree";
import { useDockview } from "~/views/contexts/DockviewContext";



export default function FileNode({
  node,
  spacing,
}: {
  node: FolderNode | FileNodeType;
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

  const adjustedLevel = node.level;
  const opened = activeFile?.path === node.path || false;

  const baseSpacing = 16;
  const leftPadding =
    adjustedLevel === 0 ? baseSpacing : (spacing * adjustedLevel) + baseSpacing;

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
          "w-full flex gap-2 items-center hover:bg-primary/20 py-1",
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
      </button>
      {expanded && (
        <DirectoryContents
          nodes={node.children}
          spacing={spacing}
        />
      )}
    </li>
  );
}
