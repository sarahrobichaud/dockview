import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";
import {
  isRouteErrorResponse,
  json,
  redirect,
  useLoaderData,
  useLocation,
  useMatches,
  useNavigate,
  useRouteError,
} from "@remix-run/react";
import { useEffect, useRef, useState, version } from "react";
import VaultAPI from "~/api/vault";
import { Button } from "~/components/ui/button";
import SecondaryHeading from "~/components/ui/typography/SecondaryHeading";

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
  PUBLIC_ADDRESS: string;
};

export const loader = async ({ params, context }: LoaderFunctionArgs) => {
  const { projectName } = params;

  const data = {
    title: projectName,
    subtitle: "Pick a Version",
    PUBLIC_ADDRESS: context.dockview.PUBLIC_ADDRESS,
  } as LoaderData;

  if (!projectName) {
    return redirect("/vault");
  }

  data.projectName = projectName;

  return json(data);
};

export default function ProjectView() {
  const { PUBLIC_ADDRESS } = useLoaderData<typeof loader>();
  const [openDialog, setOpenDialog] = useState(false);

  const { pathname } = useLocation();

  const projectView = useRef<HTMLDivElement>(null);
  const previousY = useRef(0);
  const previousRatio = useRef(0);
  const navigate = useNavigate();

  function scrollToBottom() {
    if (projectView.current)
      projectView.current.scrollIntoView({ behavior: "smooth" });
  }

  useEffect(() => {
    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        const currentY = entry.boundingClientRect.y;
        const currentRatio = entry.intersectionRatio;
        const isIntersecting = entry.isIntersecting;

        // Trigger the dialog when the user scrolls up
        if (currentY > previousY.current && !isIntersecting) {
          if (currentRatio < previousRatio.current) {
            setOpenDialog(true);
          }
        }

        previousY.current = currentY;
        previousRatio.current = currentRatio;
      });
    };

    const observer = new IntersectionObserver(handleIntersection, {
      threshold: [0.7], // Trigger when 30% of the element is visible
    });

    if (projectView.current) {
      observer.observe(projectView.current);
    }

    scrollToBottom();

    return () => {
      if (projectView.current) {
        observer.unobserve(projectView.current);
      }
    };
    // Cleanup the observer when the component unmounts
  }, []);

  function handleDialogCancel() {
    setOpenDialog(false);
    scrollToBottom();
  }
  function handleDialogConfirm() {
    // redirect one level up
    const pathWithoutProject = pathname.split("/").slice(0, -1).join("/");

    navigate(pathWithoutProject);
  }

  useEffect(() => {}, []);

  return (
    <>
      <AlertDialog open={openDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Close the current preview?</AlertDialogTitle>
            <AlertDialogDescription>
              This will close the current project and redirect you to the vault
              Browser.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleDialogCancel}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDialogConfirm}>
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <div
        className="h-screen flex items-center justify-center bg-black"
        ref={projectView}
      >
        <iframe
          src={`${PUBLIC_ADDRESS}/test`}
          className="h-full w-full border-box"
        ></iframe>
      </div>
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
