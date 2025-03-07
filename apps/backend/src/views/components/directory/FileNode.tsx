
import { ChevronDown, ChevronRight, File, FolderClosed, FolderOpen, LoaderCircle } from "@dockview/ui/icons";
import clsx from "clsx";
import { useState } from "react";
import { FileNode as FileNodeType, FolderNode } from "~/lib/filetree-builder/filetree";
import { useDockview } from "~/views/contexts/DockviewContext";
import DirectoryContents from "./DirectoryContents";



export default function FileNode({
  node,
  spacing,
}: {
  node: FolderNode | FileNodeType;
  spacing: number;
}) {

  const { selectFile, activeFile, loadingFile } = useDockview();

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

  // const chevronWidth = 24 + 4;
  const baseSpacing = 16;
  const leftPadding =
    adjustedLevel === 0 ? baseSpacing : (spacing * adjustedLevel) + baseSpacing

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
            "!font-bold bg-card !text-primary": opened,
          }
        )}
        onClick={
          node.type === "folder"
            ? expandDirectory
            : () => selectFile(opened ? null : node)
        }
      >
        {/* {node.type === 'folder' && (expanded ? <ChevronDown /> : <ChevronRight />)} */}
        {node.path === activeFile?.path && loadingFile ? <LoaderCircle className="animate-spin text-primary" /> : icon}
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
