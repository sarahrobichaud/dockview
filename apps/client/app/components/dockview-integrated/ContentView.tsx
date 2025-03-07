import { useState } from "react";
import FileExplorer from "./FileExplorer";
import clsx from "clsx";

export type ContentViewProps = {
    iframeRef: React.RefObject<HTMLIFrameElement>;
    backendURL: string;
}

export default function ContentView({ iframeRef, backendURL }: ContentViewProps) {

    const [fileExplorerExpanded, setFileExplorerExpanded] = useState(false);
    return (
        <div className="min-h-[92%] max-h-[92%] h-full relative overflow-hidden border-y-2 border-black">
            {/* <FileExplorer
                expanded={fileExplorerExpanded}
                onToggle={() => setFileExplorerExpanded(!fileExplorerExpanded)}
                className={clsx("absolute top-[calc(80px)] bg-card left-0 transition-transform duration-300", {
                    "translate-x-0": fileExplorerExpanded,
                    "translate-x-[calc(-100%+80px)]": !fileExplorerExpanded,
                })} /> */}
            <iframe
                ref={iframeRef}
                src={backendURL}
                className="min-h-full h-full w-full"
            ></iframe>
        </div>
    )
}