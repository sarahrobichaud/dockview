import React from "react";
import { useDockview } from "../../contexts/DockviewContext.js";
import clsx from "clsx";
import {
  Code,
  Eye,
  Fullscreen,
  Maximize2,
  Minimize,
  Minimize2,
  X,
} from "@dockview/ui/icons";
import { Button } from "@dockview/ui/shad";

export default function DockviewBottomNav() {
  const {
    isFullScreen,
    toggleFullScreen,
    showExplorer,
    toggleExplorer,
    activeFile,
    selectFile,
    getCurrentFileName,
  } = useDockview();

  const fileMessage = activeFile
    ? `Viewing ${activeFile.name}`
    : "No file selected.";

  return (
    <div
      className={clsx(
        "px-8 bg-background py-4 flex items-center min-h-[10vh] sticky bottom-0 max-h-[10vh] h-[10vh] z-[4] border-box",
        {
          "justify-end": !showExplorer,
          "justify-end md:justify-between": showExplorer,
        }
      )}
    >
      {showExplorer && (
        <p
          className={clsx(
            "hidden md:block text-white truncate max-w-[150px] md:max-w-full",
            {
              "!max-w-full": isFullScreen,
            }
          )}
          title={fileMessage}
        >
          {fileMessage}
        </p>
      )}
      <div className="flex gap-4 items-stretch">
        {!!activeFile && showExplorer && (
          <Button
            variant={"ghost"}
            onClick={() => {
              selectFile(null);
            }}
            className="flex gap-2 items-center"
          >
            <X />
            Close File
          </Button>
        )}

        <Button
          variant={'default'}
          onClick={() => toggleExplorer()}
        >
          {showExplorer ? <Eye /> : <Code />}
          {showExplorer ? "Show Preview" : "View Code"}
        </Button>

      </div>
    </div>
  );
}
