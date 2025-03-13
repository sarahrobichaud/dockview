import { AlertCircle, ExternalLink, Lock } from "@dockview/ui/icons";
import { Badge, Button } from "@dockview/ui/shad";
import { useRef } from "react";
import ContentView from "./ContentView";

export type DockviewViewerProps = {
	backendURL: string;
	coldStart: boolean;
	healthURL: string;
};

export default function DockviewViewer({
	backendURL,
}: DockviewViewerProps) {

	const iframeRef = useRef<HTMLIFrameElement>(null);

	const url = new URL(backendURL);

	return (
		<div className="min-h-screen h-screen relative border-t-4 border-primary max-w-screen">
			<div className="min-h-[8%] max-h-[8%] h-full flex px-8 items-center text-primary-foreground">
				<div className="w-full flex justify-between items-center gap-8">
					<Badge variant={"outline"} className="flex gap-2 items-center text-xl my-2 p-2 px-4">
						{url.protocol === "https:" ? <Lock className="text-green-500" /> : <AlertCircle className="text-orange-500" />}
						{backendURL}
					</Badge>
					<Button asChild variant={"outline"} className="flex gap-2 items-center text-xl my-2 p-2 px-4">
						<a href={backendURL} target="_blank" rel="noopener noreferrer">
							<ExternalLink className="w-4 h-4" />
							Open in new tab
						</a>
					</Button>
				</div>
			</div>
			<ContentView iframeRef={iframeRef} backendURL={backendURL} />
		</div>
	);
}
