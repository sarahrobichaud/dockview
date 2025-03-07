import React, { useEffect, useMemo } from "react";
import clsx from "clsx";
import { useState } from "react";
import { useDockview } from "../contexts/DockviewContext";
import { FileNode as FileNodeType, FolderNode as FolderNodeType } from "~/lib/filetree-builder/filetree";
import FileNode from "./directory/FileNode";


const spacingOptions = [4, 8] as const;

type DockviewFileBrowserProps = {
  files: (FolderNodeType | FileNodeType)[];
  showExplorer: boolean;
}

export default function DockviewFileBrowser({ files, showExplorer, }: DockviewFileBrowserProps) {
  const [spacing, setSpacing] = useState<number>(spacingOptions[0]);

  const [isFullScreen, setIsFullScreen] = useState(false);

  const { selectFile } = useDockview();

  return (
    <div
      style={{ scrollbarGutter: "stable" }}
      className={clsx(
        "rw-file-browser group bg-background text-background-foreground opacity-0 absolute inset-0 z-[2] pointer-events-none transition translate-x-[-100%] border-r border-border not-prose overflow-x-auto overflow-y-auto transition-all translate-x-[-100%]",
        {
          "!opacity-100 !pointer-events-auto": showExplorer,
          "!translate-x-[-99%] max-w-[80%] md:max-w-[30%] hover:!translate-x-[-20%] md:hover:!translate-x-[-50%]":
            showExplorer && !isFullScreen,
          "!translate-x-[-99%] max-w-[80%] hover:!translate-x-[-20%] xl:hover:!translate-x-[-100%] xl:overflow-y-scroll xl:!translate-x-[-100%] md:max-w-[30%]":
            showExplorer && isFullScreen,
          "after:content-[''] after:inset-0 after:bg-background opacity-100 after:absolute hover:after:opacity-0 after:pointer-events-none after:transition-opacity after:duration-500 ":
            true,
          "after:xl:opacity-0": isFullScreen,
          "!opacity-0 after:opacity-0:": !showExplorer,
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
