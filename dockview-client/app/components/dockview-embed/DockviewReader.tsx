import React from "react";
import clsx from "clsx";
import { useEffect, useState } from "react";
import DockviewFileBrowser from "./DockviewFileBrowser";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { useDockview } from "../../contexts/DockviewContext";
import { Loader2 } from "lucide-react";
import { LoadedModule } from "../../utils/utils";

let fileCache = {};

setInterval(() => {
  fileCache = {};
}, 2000);

export default function DockviewReader() {
  const [text, setText] = useState<string | null>();
  const [loading, setLoading] = useState(false);

  const { activeVersion, showExplorer, isFullScreen } = useDockview();

  const getLanguage = (fileName) => {
    if (fileName.endsWith(".tsx") || fileName.endsWith(".ts"))
      return "typescript";
    if (fileName.endsWith(".jsx") || fileName.endsWith(".js"))
      return "javascript";
    if (fileName.endsWith(".css")) return "css";
    if (fileName.endsWith(".html")) return "html";
    return "plaintext";
  };

  // useEffect(() => {
  //   setText(null);
  //   if (activeFile === null) return;

  //   async function fetchFile(activeFile: LoadedModule) {
  //     const res = await fetch(`/demos/${moduleName}${activeFile.path}`);
  //     const rawText = await res.text();

  //     return rawText;
  //   }

  //   if (fileCache[activeFile.path]) {
  //     setText(fileCache[activeFile.path]);
  //     return;
  //   }

  //   setLoading(true);

  //   const timeout = setTimeout(async () => {
  //     fileCache[activeFile.path] = await fetchFile(activeFile);
  //     setText(fileCache[activeFile.path]);
  //     setLoading(false);
  //   }, 200);

  //   return () => {
  //     clearTimeout(timeout);
  //   };
  // }, [activeFile]);

  return (
    <div></div>
    // <div
    //   className={clsx(
    //     "absolute inset-0 z-[-1] bg-gray-200/70 transition-transform",
    //     {
    //       "!translate-x-[15%] max-w-[100%]": showExplorer && !isFullScreen,
    //       "!translate-x-[15%] max-w-[100%] xl:!translate-x-[30%] xl:max-w-[100%]":
    //         showExplorer && isFullScreen,
    //     }
    //   )}
    // >
    //   <DockviewFileBrowser />
    //   {!activeFile && (
    //     <div
    //       className={clsx(
    //         "bg-gray-200 -z-[1] h-full flex max-w-[70%] justify-center items-center pointer-events-none",
    //         {
    //           "max-w-[85%]": !isFullScreen,
    //           "max-w-[85%] xl:max-w-[70%]": isFullScreen,
    //         }
    //       )}
    //     >
    //       <p className="subtitle">Please select a file</p>
    //     </div>
    //   )}
    //   {activeFile &&
    //     (!text ? (
    //       <div
    //         className={clsx(
    //           "h-full flex max-w-[70%] justify-center bg-gray-200 items-center pointer-events-none",
    //           {
    //             "max-w-[85%]": !isFullScreen,
    //             "max-w-[85%] xl:max-w-[70%]": isFullScreen,
    //           }
    //         )}
    //       >
    //         <Loader2 className="animate-spin" />
    //       </div>
    //     ) : (
    //       <div
    //         style={{ scrollbarGutter: "stable" }}
    //         className={clsx("relative min-h-[100%] not-prose", {
    //           "max-w-[85%]": !isFullScreen,
    //           "max-w-[85%] xl:max-w-[70%]": isFullScreen,
    //         })}
    //       >
    //         <SyntaxHighlighter
    //           showLineNumbers
    //           customStyle={{
    //             position: "absolute",
    //             inset: "0",
    //             scrollbarGutter: "stable",
    //             overflow: "scroll",
    //             width: "100%",
    //             height: "100%",
    //           }}
    //           language={getLanguage(activeFile.path)}
    //         >
    //           {text}
    //         </SyntaxHighlighter>
    //       </div>
    //     ))}
    // </div>
  );
}
