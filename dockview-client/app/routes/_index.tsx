import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import {
  isRouteErrorResponse,
  json,
  useLoaderData,
  useRouteError,
} from "@remix-run/react";
import VaultAPI from "~/api/vault";
import { GetAllProjectsResponse } from "~/lib/dockview-api";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export const loader = async ({ context }: LoaderFunctionArgs) => {
  const { dockview } = context;
  console.log({ dockview });

  const projects = await VaultAPI.fetchAvailableProjectsNames(context);

  return json({ projects, PUBLIC_ADDRESS: dockview.PUBLIC_ADDRESS });
};

export default function Index() {
  const { PUBLIC_ADDRESS, projects } = useLoaderData<typeof loader>();

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="mx-auto w-full max-w-[500px] text-center">
        <h1 className="text-5xl my-6">Dockview Prototype</h1>
        <div className="my-4 bg-gray-500 rounded p-4">
          <h2 className="text-2xl">Fetch test</h2>
          <p>{projects.resource.message}</p>

          {projects.resource.result.map((project) => {
            return <p key={project}>{project}</p>;
          })}
        </div>
        <div className="my-4 bg-gray-500 rounded h-[500px]">
          <h2 className="text-2xl">Iframe Test</h2>
          <iframe
            src={`${PUBLIC_ADDRESS}/test`}
            className="h-full w-full border-box"
          ></iframe>
        </div>
      </div>
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
