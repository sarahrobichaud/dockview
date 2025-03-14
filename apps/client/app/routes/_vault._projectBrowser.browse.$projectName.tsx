import { LimitedProjectAnalysis } from "@dockview/core/shared";
import { CircleHelp, FileText, Hammer, Server } from "@dockview/ui/icons";
import {
	Button, Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger
} from "@dockview/ui/shad";
import { useEffect, useRef, useState } from "react";
import type { LoaderFunctionArgs, MetaFunction } from "react-router";
import {
	isRouteErrorResponse,
	Link,
	Outlet,
	redirect,
	useLoaderData,
	useMatches,
	useRouteError
} from "react-router";
import VaultAPI from "~/api/vault";
import Container from "~/components/layout/Container";

export const meta: MetaFunction = () => {
	return [
		{ title: "New Remix App" },
		{ name: "description", content: "Welcome to Remix!" },
	];
};

export type LoaderData = {
	title: string;
	subtitle: string;
	availableVersions: Awaited<
		ReturnType<typeof VaultAPI.fetchAvailableProjectVersions>
	>;
	projectName: string;
};

export const loader = async ({ params, context }: LoaderFunctionArgs) => {
	const { projectName } = params;

	const data = {
		title: projectName,
		subtitle: "Pick a Version",
	} as LoaderData;

	if (!projectName) {
		return redirect("/vault");
	}

	data.availableVersions = await VaultAPI.fetchAvailableProjectVersions(
		context,
		projectName
	);

	data.projectName = projectName;

	return data;
};

export type VersionIconsProps = {
	details: LimitedProjectAnalysis;
}

export const VersionIcons = ({ details }: VersionIconsProps) => {
	switch (details.environment) {
		case "static-server":
			return (
				<>
					<Server />
					<FileText />
					{details.buildRequired && <Hammer />}
				</>
			)
		case "node-server":
			return (
				<>
					<Server />
					{details.buildRequired && <Hammer />}
				</>
			)
		case "static":
			return (
				<>
					<FileText />
					{details.buildRequired && <Hammer />}
				</>
			)
		default:
			return <CircleHelp />
	}
}

export default function Index() {
	const { availableVersions, projectName } = useLoaderData<typeof loader>();

	const [selectedVersion, setSelectedVersion] = useState<string | null>(null);
	const [viewing, setViewing] = useState(false);
	const matches = useMatches();
	const routeLevel = useRef(matches.length);

	useEffect(() => {
		if (matches.length < routeLevel.current) {
			setViewing(false);
			setSelectedVersion(null);
		}

		if (routeLevel.current !== matches.length) {
			routeLevel.current = matches.length;
		}
	}, [matches]);

	const vaultBrowser = useRef<HTMLDivElement>(null);

	return (
		<>
			<div className="mb-20" ref={vaultBrowser}>
				<Container className="pl-[calc(0.5rem+100px)]">
					<div className="my-4 flex gap-2 items-center">
						{availableVersions.data.map(({ version, details }) => {
							return (
								<TooltipProvider key={version}>
									<Tooltip>
										<TooltipTrigger asChild>
											<Button
												onClick={() =>
													setSelectedVersion((prev) =>
														prev === version ? null : version
													)
												}
												variant={version === selectedVersion ? "default" : "outline"}
												className="flex gap-2 items-center"
											>
												v{version}
												<VersionIcons details={details} />

											</Button>
										</TooltipTrigger>
										<TooltipContent>
											<p>{details.buildRequired ? "Build Required" : "Ready"}</p>
										</TooltipContent>
									</Tooltip>
								</TooltipProvider>
							);
						})}
					</div>
					{selectedVersion && !!!viewing && (
						<div className="my-4 flex gap-4 justify-start">
							<Button asChild onClick={() => setViewing(true)}>
								<Link to={`/browse/${projectName}/${selectedVersion}/view`}>
									Launch {projectName}@{selectedVersion}
								</Link>
							</Button>
							{/* <Button variant={"secondary"}>Embed</Button> */}
						</div>
					)}
				</Container>
			</div>
			<Outlet />
		</>
	);
}

export function ErrorBoundary() {
	const error = useRouteError();

	if (isRouteErrorResponse(error)) {
		return (
			<div>
				<h1>
					{error.status} {error.statusText}
				</h1>
				<p>{error.data}</p>
			</div>
		);
	} else if (error instanceof Error) {
		return (
			<div>
				<h1>Error</h1>
				<p>{error.message}</p>
				<p>The stack trace is:</p>
				<pre>{error.stack}</pre>
			</div>
		);
	} else {
		return <h1>Unknown Error</h1>;
	}
}
