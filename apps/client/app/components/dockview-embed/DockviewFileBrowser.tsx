import React, { useEffect, useMemo } from "react";
import clsx from "clsx";
import type { ProcessedFolder } from "../../utils/utils";
import { useState } from "react";
import FileTreeUtils from "../../utils/utils";
import FileNode from "../directory/FileNode";
import { useDockview } from "../../contexts/DockviewContext";

const spacingOptions = [4, 8] as const;

export default function DockviewFileBrowser() {
  const [spacing, setSpacing] = useState<number>(spacingOptions[0]);

  const { isFullScreen, activeVersion, showExplorer } = useDockview();

  return (
    // <div
    //   style={{ scrollbarGutter: "stable" }}
    //   className={clsx(
    //     "rw-file-browser group bg-gray-100 opacity-0 absolute inset-0 z-[2] pointer-events-none transition translate-x-[-100%] border-r border-gray-400 not-prose overflow-x-auto overflow-y-auto transition-all translate-x-[-100%]",
    //     {
    //       "!opacity-100 !pointer-events-auto": showExplorer,
    //       "!translate-x-[-99%] max-w-[80%] md:max-w-[30%] hover:!translate-x-[-20%] md:hover:!translate-x-[-50%]":
    //         showExplorer && !isFullScreen,
    //       "!translate-x-[-99%] max-w-[80%] hover:!translate-x-[-20%] xl:hover:!translate-x-[-100%] xl:overflow-y-scroll xl:!translate-x-[-100%] md:max-w-[30%]":
    //         showExplorer && isFullScreen,
    //       "after:content-[''] after:inset-0 after:bg-gray-100 opacity-100 after:absolute hover:after:opacity-0 after:pointer-events-none after:transition-opacity after:duration-500 ":
    //         true,
    //       "after:xl:opacity-0": isFullScreen,
    //       "!opacity-0 after:opacity-0:": !showExplorer,
    //     }
    //   )}
    // >
    //   <div
    //     className={clsx(
    //       "flex justify-between top-0 sticky py-4 text-charcoal border-b-2 border-gray-300 bg-gray-100 items-center pl-4 pr-2 left-0 right-0 mb-4 mr-[2px]"
    //     )}
    //   >
    //     <p className="!text-normal">Tree Spacing</p>
    //     <div className="flex gap-2 transition-opacity">
    //       {spacingOptions.map((option) => {
    //         return (
    //           <button
    //             key={option}
    //             className={clsx(
    //               "px-2 py-1 items-center justify-center flex text-charcoal border-charcoal border-2 rounded-md opacity-50 hover:opacity-100",
    //               {
    //                 "bg-charcoal !text-white !opacity-100": option === spacing,
    //               }
    //             )}
    //             onClick={() => setSpacing(option)}
    //           >
    //             {option}px
    //           </button>
    //         );
    //       })}
    //     </div>
    //   </div>
    //   <ul className={clsx("list-none transition")}>
    //     {files.map((dir) => {
    //       return <FileNode key={dir.path} node={dir} spacing={spacing} />;
    //     })}
    //   </ul>
    // </div>
    <div>hello</div>
  );
}
