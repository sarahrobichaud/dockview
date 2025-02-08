import { useEffect, useRef, useState } from "react";
import { Button } from "@dockview/ui/components/shad-ui/button";
import TypoLead from "@dockview/ui/components/typography/Lead";
import SecondaryHeading from "@dockview/ui/components/typography/SecondaryHeading";
import MainHeading from "@dockview/ui/components/typography/MainHeading";
import { useAnimatedText } from "~/hooks/useAnimatedText";
import clsx from "clsx";
import { Link } from "react-router";
import { DockviewInstancePublicDTO } from "@dockview/core/models";
import { AlertCircle, Lock, CheckCircle, Loader2, Radio} from "lucide-react";
import { DockviewAPIResponse } from "@dockview/core/api";

export type DockviewViewerProps = {
	backendURL: string;
	coldStart: boolean;
	healthURL: string;
};

export default function DockviewViewer({
	coldStart,
	backendURL,
	healthURL,
}: DockviewViewerProps) {
	console.log("DockviewViewer", { backendURL, healthURL });
	const [loading, setLoading ] = useState(false);
	const [ready, setReady] = useState(false);
	const [status, setStatus] = useState<string>("Getting ready...");

	const text = coldStart ? "Launching 🚀" : "Loading 🛸";
	const duration = coldStart ? 0: 0;

	const iframeRef = useRef<HTMLIFrameElement>(null);

	const url = new URL(backendURL);

	const animatedLoadingText = useAnimatedText(text, 60, "⚙️ 08gq39w2e");

	return (
		<div className="min-h-screen h-screen relative bg-background text-background-foreground border-border border-t-4 border-primary max-w-screen">
			<div className="min-h-[10%] max-h-[10%] h-full flex px-8 items-center">
				<div className="w-full flex justify-between items-center">
					<TypoLead className="flex gap-2 items-center my-2">
						{url.protocol === "https:" ? <Lock /> : <AlertCircle />}
						{backendURL}
					</TypoLead>
					<div className="flex items-center gap-2">
						{status === "ready" ? (
							<>
								<Radio className="text-primary animate-pulse" />
								<span>Connected</span>
							</>
						) : (
							<>
								<Loader2 className="animate-spin" />
								<span>{status}</span>
							</>
						)}
					</div>
				</div>
			</div>
			<div className="min-h-[80%] max-h-[80%] h-full relative overflow-hidden border-y-2 border-black">
				<div
					className={clsx(
						"absolute inset-0 translate-y-0 opacity-100 pointer-events-none duration-1000 transition-all bg-white flex justify-center items-center min-h-full h-full w-full",
						{
							"translate-y-[-110%] opacity-0": loading,
						}
					)}
				>
					<div className="flex gap-2 items-center">
						<span className="animate-spin">X</span>
						{/* TODO: prevent 2 h1 on the same page */}
						<MainHeading className="font-mono">
							{animatedLoadingText}
						</MainHeading>
					</div>
				</div>
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
