import { useRef, useState } from "react";
import { Button } from "@dockview/ui/components/shad-ui/button";
import TypoLead from "@dockview/ui/components/typography/Lead";
import { AlertCircle, Lock, CheckCircle, Loader2, Radio } from "lucide-react";

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
		<div className="min-h-screen h-screen relative bg-background text-background-foreground border-border border-t-4 border-primary max-w-screen">
			<div className="min-h-[10%] max-h-[10%] h-full flex px-8 items-center">
				<div className="w-full flex justify-between items-center">
					<TypoLead className="flex gap-2 items-center my-2">
						{url.protocol === "https:" ? <Lock /> : <AlertCircle />}
						{backendURL}
					</TypoLead>
				</div>
			</div>
			<div className="min-h-[80%] max-h-[80%] h-full relative overflow-hidden border-y-2 border-black">
				<iframe
					ref={iframeRef}
					src={backendURL}
					className="min-h-full h-full w-full"
				></iframe>
			</div>
			<div className="min-h-[10%] max-h-[10%] h-full">
				<div className="flex items-center justify-end gap-4 h-full px-8">
					<Button variant={"default"} asChild>
						<a href={backendURL} target="_blank">
							Open Preview in New Tab
						</a>
					</Button>
					<Button variant={"default"}>View Code</Button>
					<Button variant={"default"}>FullScreen</Button>
				</div>
			</div>
		</div>
	);
}
