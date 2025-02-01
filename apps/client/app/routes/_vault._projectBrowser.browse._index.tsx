import type { LoaderFunctionArgs, MetaFunction } from "react-router";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "~/components/ui/carousel"
import {
  isRouteErrorResponse,
  Link,
  Outlet,
  useLoaderData,
  useMatches,
  useRouteError,
} from "react-router";
import { useEffect, useState } from "react";
import VaultAPI from "~/api/vault";
import Container from "~/components/layout/Container";
import { Button } from "~/components/ui/button";
import MainHeading from "~/components/ui/typography/MainHeading";
import { Card, CardContent, CardHeader, CardTitle  } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { FlaskConical, Heart, Link2, Server } from "lucide-react";
import TypoLead from "~/components/ui/typography/Lead";
import SecondaryHeading from "~/components/ui/typography/SecondaryHeading";
export const meta: MetaFunction = () => {
  return [
    { title: "Dockview - Projects" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export const loader = async ({
  request,
  params,
  context,
}: LoaderFunctionArgs) => {
  const { dockview } = context;

  const projects = await VaultAPI.fetchAvailableProjects(context);

  return { dockviewProjects: projects, PUBLIC_ADDRESS: dockview.PUBLIC_ADDRESS };
};

export default function Index() {
  const { PUBLIC_ADDRESS, dockviewProjects } = useLoaderData<typeof loader>();

  return (
    <div>

            <div className="grid grid-cols-1 mb-24 md:grid-cols-2 lg:grid-cols-3 gap-16">
                <div className="col-span-2">
                  <SecondaryHeading className="mb-4 flex gap-2 items-center">
                    <Heart/>
                    Featured Projects</SecondaryHeading>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 py-4 rounded-md max-h-[500px] overflow-y-auto">
                  {dockviewProjects.data.map((project) => {
                    return (
                      <Link to={`/browse/${project.name}`} className="group"> 
                      <Card key={project.name} className="p-4 group-hover:bg-muted bg-background-muted">
                        <CardHeader>
                          <CardTitle className="flex gap-2 items-center">
                            {project.name}
                          <Badge variant={'default'}>
                            Dockview Instances</Badge>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p>{project.versions.length} Versions</p>
                        </CardContent>
                      </Card>
            </Link>
                    );

                  })}
                  </div>
                </div>
                <div className="col-span-1">
                    <SecondaryHeading className="mb-4 flex gap-2 items-center">Dockview Instances?</SecondaryHeading>
                    <div className="flex flex-col gap-2 text-sm">
                    <p className="">Dockview is a tool I wrote to showcase my projects and demos.</p>
                    <p>It allows me to spin up instances of my projects on the fly, and share them with others.</p>
                    <a href="https://github.com/sarahrobichaud/dockview/tree/develop/apps/backend" target="_blank" rel="noopener noreferrer" className="text-primary text-lg flex gap-2 items-center">
                    <Link2/>
                    sarahrobichaud/dockview.git</a>
                    </div>
                </div>
            </div>
            <div>
              <Outlet/>
            </div>
            <div className="grid mb-24 grid-cols-1 md:grid-cols-5 gap-32">
              <div className="col-span-2">
              <SecondaryHeading className="mb-4 flex gap-2 items-center">
                <FlaskConical/>
                Experiments</SecondaryHeading>
                <Carousel>
                  <CarouselContent>
                    {dockviewProjects.data.map((project) => {
                      return (
                        <CarouselItem key={project.name}>
                          <Link to={`/browse/${project.name}`} className="group w-full inline-block"> 
                      <Card key={project.name} className="p-4 group-hover:bg-primary/60 bg-primary text-primary-foreground w-full h-[200px]">
                        <CardHeader>
                          <CardTitle className="flex gap-2 items-center">
                            {project.name}
                          <Badge variant={'secondary'}>
                            Dockview Instances</Badge>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p>{project.versions.length} Versions</p>
                        </CardContent>
                      </Card>
                          </Link>
                        </CarouselItem>
                    );
                  })}
                  </CarouselContent>
                  <CarouselPrevious/>
                  <CarouselNext/>
                </Carousel>
              </div>
              <div className="col-span-3">
                <SecondaryHeading className="mb-4 flex gap-2 items-center">Case Studies</SecondaryHeading>
                <div className="grid grid-cols-1 gap-4">
                  <div className="bg-background border border-border w-full h-[300px] rounded-md flex justify-center items-center">
                    <TypoLead>Coming Soon 📝</TypoLead>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <SecondaryHeading className="mb-4 flex gap-2 items-center">
                Everything, Everywhere, All at Once 🚀
                </SecondaryHeading>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-card w-full h-[300px] rounded-md"></div>
                  <div className="bg-card w-full h-[300px] rounded-md"></div>
                  <div className="bg-card w-full h-[300px] rounded-md"></div>
                  <div className="bg-card w-full h-[300px] rounded-md"></div>
                  <div className="bg-card w-full h-[300px] rounded-md"></div>
                  <div className="bg-card w-full h-[300px] rounded-md"></div>
                  <div className="bg-card w-full h-[300px] rounded-md"></div>
                  <div className="bg-card w-full h-[300px] rounded-md"></div>
                  <div className="bg-card w-full h-[300px] rounded-md"></div>
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
