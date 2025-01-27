import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import TypoLead from "../ui/typography/Lead";
import SecondaryHeading from "../ui/typography/SecondaryHeading";
import MainHeading from "../ui/typography/MainHeading";
import { useAnimatedText } from "~/hooks/useAnimatedText";
import clsx from "clsx";
import { Link } from "react-router";
import { AlertCircle, Lock } from "lucide-react";

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
	const duration = coldStart ? 1000 : 500;

	const url = new URL(backendURL);

	const animatedLoadingText = useAnimatedText(text, 60, "⚙️ 08gq39w2e");

	useEffect(() => {
		// Fake loading time

		const checkHealth = async () => {
			try {
				const res = await fetch(healthURL);
				const json = await res.json();

				console.log("checkHealth", json);

				if (json.status === "ready") {
					setReady(true);
					clearInterval(interval);
					return;
				}

				setStatus(json.status);

			} catch (err) {
				// If error, retry in 1s
			}
		};


		const interval = setInterval(() => {
			checkHealth();
		}, 500);

		if (coldStart) {
			checkHealth();
		}

		const timeout = setTimeout(() => {
			setLoading(true);
		}, duration);

		return () => {
			clearTimeout(timeout);
			clearInterval(interval);
		};
	});

	return (
		<div className="min-h-screen h-screen relative">
			<div className="min-h-[20%] max-h-[20%] h-full flex items-end pb-2 px-8">
				<div>
					<SecondaryHeading className="font-mono">Dockview</SecondaryHeading>
					<TypoLead className="flex gap-2 items-center my-2">
						{url.protocol === "https:" ? <Lock /> : <AlertCircle />}
						{backendURL}
					</TypoLead>
				</div>
			</div>
			<div className="min-h-[70%] max-h-[70%] h-full relative overflow-hidden border-y-2 border-black">
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
				{ready?(
				 <iframe
				 	src={backendURL}
				 	className="min-h-full h-full w-full"
				 ></iframe>
				):(
					<div className="min-h-full h-full w-full flex items-center justify-center">
						<TypoLead>{status}</TypoLead>
					</div>
				)}
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
