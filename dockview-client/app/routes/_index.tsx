import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import {
  isRouteErrorResponse,
  json,
  Link,
  Outlet,
  useLoaderData,
  useRouteError,
} from "@remix-run/react";
import { useState } from "react";
import VaultAPI from "~/api/vault";
import { Button } from "~/components/ui/button";
import MainHeading from "~/components/ui/typography/MainHeading";
import { useAnimatedText } from "~/hooks/useAnimatedText";

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

  const animatedTitle = useAnimatedText("Dockview", 30, "weivkcoD");

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="mx-auto w-full max-w-[600px]">
        <MainHeading>
          <span className="font-mono font-normal">{animatedTitle}</span>{" "}
          Prototype
        </MainHeading>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          I created this project to learn more about Docker and Web Servers. My
          primary objective was create a nice workflow and presentation for
          creating small demos as well as showcasing bigger projects.
        </p>
        <div className="flex">
          <Button className="my-4 flex-1" asChild>
            <Link to="/browse">Explore my projects</Link>
          </Button>
          <Button className="my-4 flex-1" variant={"link"}>
            LinkedIn
          </Button>
          <Button className="my-4 flex-1" variant={"link"}>
            GitHub
          </Button>
        </div>
        <div>
          <p>Made with 💖, by Sarah Robichaud</p>
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
