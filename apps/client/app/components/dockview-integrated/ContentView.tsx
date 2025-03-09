import { useState } from "react";

export type ContentViewProps = {
    iframeRef: React.RefObject<HTMLIFrameElement>;
    backendURL: string;
}

export default function ContentView({ iframeRef, backendURL }: ContentViewProps) {

    const [fileExplorerExpanded, setFileExplorerExpanded] = useState(false);
    return (
        <div className="min-h-[92%] max-h-[92%] h-full relative overflow-hidden border-y-2 border-black">
            <iframe
                ref={iframeRef}
                src={backendURL}
                className="min-h-full h-full w-full"
            ></iframe>
        </div>
    )
}