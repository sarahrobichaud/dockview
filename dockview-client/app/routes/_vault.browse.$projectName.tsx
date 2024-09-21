import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import {
  isRouteErrorResponse,
  json,
  redirect,
  useLoaderData,
  useRouteError,
} from "@remix-run/react";
import VaultAPI from "~/api/vault";
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
  versions: Awaited<ReturnType<typeof VaultAPI.fetchAvailableProjectVersions>>;
};

export const loader = async ({ params, context }: LoaderFunctionArgs) => {
  const { projectName } = params;

  const data = {
    title: projectName,
    subtitle: "2. Pick a Version",
  } as LoaderData;

  if (!projectName) {
    return redirect("/vault");
  }

  data.versions = await VaultAPI.fetchAvailableProjectVersions(
    context,
    projectName
  );

  return json(data);
};

export default function Index() {
  const { versions } = useLoaderData<typeof loader>();

  return (
    <div className="my-4 flex gap-2 items-center">
      {versions.resource.result.map((version) => {
        return (
          <Button key={version} variant={"outline"}>
            v{version}
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
