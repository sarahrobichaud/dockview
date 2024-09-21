import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import {
  isRouteErrorResponse,
  json,
  Link,
  Outlet,
  useLoaderData,
  useMatches,
  useRouteError,
} from "@remix-run/react";
import { useEffect, useState } from "react";
import VaultAPI from "~/api/vault";
import { Button } from "~/components/ui/button";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export const loader = async ({
  request,
  params,
  context,
}: LoaderFunctionArgs) => {
  const { dockview } = context;

  const projects = await VaultAPI.fetchAvailableProjectsNames(context);

  return json({ projects, PUBLIC_ADDRESS: dockview.PUBLIC_ADDRESS });
};

export default function Index() {
  const { PUBLIC_ADDRESS, projects } = useLoaderData<typeof loader>();

  return (
    <div className="my-4 flex gap-2 items-center">
      {projects.resource.result.map((project) => {
        return (
          <Button key={project} variant={"default"} asChild>
            <Link to={`/browse/${project}`}>{project}</Link>
          </Button>
        );
      })}
    </div>
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
