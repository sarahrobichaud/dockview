import React from "react";
import { useDockview } from "../../contexts/DockviewContext.bak";
import clsx from "clsx";
import {
  Code,
  Eye,
  Fullscreen,
  Maximize2,
  Minimize,
  Minimize2,
} from "lucide-react";

export default function DockviewBottomNav() {
  const {
    isFullScreen,
    toggleFullScreen,
    showExplorer,
    toggleExplorer,
    activeFile,
    getCurrentFileName,
  } = useDockview();

  const fileMessage = activeFile
    ? `Viewing ${activeFile.name} from Version ${activeFile.version}`
    : "No file selected.";

  return (
    <div
      className={clsx(
        "px-8 bg-charcoal py-4 flex items-center min-h-[10%] max-h-[10%] h-[10%] sticky bottom-0 z-[4] border-box",
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
        <button
          className={clsx(
            "px-4 whitespace-nowrap py-2 bg-charcoal text-white border-gray-200 border-2 flex items-center gap-2  rounded-md opacity-50 hover:opacity-100",
            {
              "hover:bg-gray-200 hover:!text-charcoal hover:!opacity-100": true,
            }
          )}
          onClick={() => toggleExplorer()}
        >
          {showExplorer ? <Code /> : <Eye />}
          {showExplorer ? "Show Preview" : "View Code"}
        </button>
        <button
          className={clsx(
            "px-4 py-2 bg-charcoal text-white border-gray-200 border-2 rounded-md opacity-50 hover:opacity-100",
            {
              "hover:bg-gray-200 hover:!text-charcoal hover:!opacity-100": true,
            }
          )}
          title="Toggle Fullscreen"
          onClick={() => {
            toggleFullScreen();
          }}
        >
          {isFullScreen ? <Minimize2 /> : <Fullscreen />}
        </button>
      </div>
    </div>
  );
}
