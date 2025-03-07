import React, { useEffect, useMemo } from "react";
import clsx from "clsx";
import { useState } from "react";
import { useDockview } from "../contexts/DockviewContext";
import { FileNode as FileNodeType, FolderNode as FolderNodeType } from "~/lib/filetree-builder/filetree";
import FileNode from "./directory/FileNode";


const spacingOptions = [4, 8, 12] as const;

type DockviewFileBrowserProps = {
  files: (FolderNodeType | FileNodeType)[];
  showExplorer: boolean;
}

export default function DockviewFileBrowser({ files, showExplorer, }: DockviewFileBrowserProps) {
  const [spacing, setSpacing] = useState<number>(spacingOptions[2]);

  const [isFullScreen, setIsFullScreen] = useState(false);

  const { selectFile } = useDockview();

  return (
    <div
      style={{ scrollbarGutter: "stable" }}
      className={clsx(
        "rw-file-browser group bg-background text-background-foreground opacity-0 relative inline-block inset-0 z-[2] pointer-events-none border-r border-border not-prose overflow-x-auto overflow-y-auto transition-all translate-x-0",
        {
          "!opacity-100 !pointer-events-auto": showExplorer,
          "w-[20%]":
            showExplorer && !isFullScreen,
        }
      )}
    >
      <div
        className={clsx(
          "flex justify-between top-0 sticky py-4 text-card-foreground border-b-2 border-border bg-card items-center pl-4 pr-2 left-0 right-0 mb-4 mr-[2px]"
        )}
      >
        <p className="!text-normal">Tree Spacing</p>
        <div className="flex gap-2 transition-opacity">
          {spacingOptions.map((option) => {
            return (
              <button
                key={option}
                className={clsx(
                  "px-2 py-1 items-center justify-center flex text-charcoal border-charcoal border-2 rounded-md opacity-50 hover:opacity-100",
                  {
                    "bg-charcoal !text-white !opacity-100": option === spacing,
                  }
                )}
                onClick={() => setSpacing(option)}
              >
                {option}px
              </button>
            );
          })}
        </div>
      </div>
      <ul className={clsx("list-none transition")}>
        {files.map((dir) => {
          return <FileNode key={dir.path} node={dir} spacing={spacing} />;
        })}
      </ul>
    </div>
  );
}
