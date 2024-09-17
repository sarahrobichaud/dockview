import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import {
  isRouteErrorResponse,
  json,
  useLoaderData,
  useRouteError,
} from "@remix-run/react";
import { useState } from "react";
import VaultAPI from "~/api/vault";
import { Button } from "~/components/ui/button";
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
  const [selectedProject, setSelectedProject] = useState<string | null>(null);

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="mx-auto w-full max-w-[800px]">
        <h1 className="my-8 scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
          Dockview Prototype
        </h1>

        <div className="">
          <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
            My Vault
          </h2>
          <div className="my-4 flex gap-2 items-center">
            {projects.resource.result.map((project) => {
              return (
                <Button
                  key={project}
                  onClick={(e) => {
                    console.log("clicked", project);
                    setSelectedProject(project);
                  }}
                  variant={selectedProject === project ? "default" : "outline"}
                >
                  {project}
                </Button>
              );
            })}
          </div>
        </div>
        <div className="my-4 rounded h-[500px]">
          <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
            External Container Test
          </h2>
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
