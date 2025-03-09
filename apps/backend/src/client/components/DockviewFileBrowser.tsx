import React, { useEffect, useMemo } from "react";
import clsx from "clsx";
import { useState } from "react";
import { useDockview } from "../contexts/DockviewContext.js";
import { FileNode as FileNodeType, FolderNode as FolderNodeType } from "~/lib/filetree-builder/filetree.js";
import FileNode from "./directory/FileNode.js";
import { Button } from "@dockview/ui/shad";
import { TypoLead } from "@dockview/ui/typography";


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
          "flex justify-between top-0 sticky py-4 text-background-foreground border-b-2 border-border bg-background items-center pl-4 pr-2 left-0 right-0 mb-4 mr-[2px]"
        )}
      >
        <TypoLead>Tree Spacing</TypoLead>
        <div className="flex gap-2 transition-opacity">
          {spacingOptions.map((option) => {
            return (
              <Button
                key={option}
                variant="ghost"
                className={clsx(
                  {
                    "!text-primary": option === spacing,
                  }
                )}
                onClick={() => setSpacing(option)}
              >
                {option}px
              </Button>
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
