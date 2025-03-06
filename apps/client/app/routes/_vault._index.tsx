import type { MetaFunction } from "react-router";
import { isRouteErrorResponse, Link, useRouteError } from "react-router";
import { Button } from "@dockview/ui/components/shad-ui/button";
import TypoLead from "@dockview/ui/components/typography/Lead";
import MainHeading from "@dockview/ui/components/typography/MainHeading";
import { useAnimatedText } from "@dockview/ui/hooks";

export const meta: MetaFunction = () => {
  return [
    { title: "Dockview" },
    { name: "description", content: "Welcome to Dockview!" },
  ];
};

export default function Index() {

  const animatedTitle = useAnimatedText("Home page", 30, "weivkcoD");
  const animatedName = useAnimatedText(
    "Sarah Robichaud",
    30,
    "Robichaud Sarah"
  );

  return (
    <div className="flex justify-center items-center">
      <div className="mx-auto w-full max-w-[600px]">
        <MainHeading>
          <span className="font-mono font-normal">{animatedTitle}</span>{" "}
        </MainHeading>
        <TypoLead className="my-4">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Corporis voluptas eveniet in maxime asperiores vero animi quis sit, alias sint enim, perspiciatis accusamus? Vel molestiae suscipit tempore id reprehenderit, reiciendis rem aliquam debitis eligendi, quae consectetur est illo nisi inventore.
        </TypoLead>
        <p className="leading-7 [&:not(:first-child)]:mt-6"></p>
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
        <TypoLead>
          Powered by ☕
        </TypoLead>
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
