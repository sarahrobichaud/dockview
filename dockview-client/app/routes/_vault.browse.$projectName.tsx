import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import {
	isRouteErrorResponse,
	json,
	Outlet,
	redirect,
	useLoaderData,
	Link,
	useRouteError,
	useRevalidator,
	useLocation,
	useMatches,
} from "@remix-run/react";
import { useEffect, useRef, useState, version } from "react";
import VaultAPI from "~/api/vault";
import Container from "~/components/layout/Container";
import { Button } from "~/components/ui/button";

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

	return json(data);
};

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
						{availableVersions.resource.result.map((version) => {
							return (
								<Button
									key={version}
									onClick={() =>
										setSelectedVersion((prev) =>
											prev === version ? null : version
										)
									}
									variant={version === selectedVersion ? "default" : "outline"}
								>
									v{version}
								</Button>
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
