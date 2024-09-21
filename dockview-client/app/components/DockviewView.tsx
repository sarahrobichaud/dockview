import React, { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { Suspense } from "react";
import { LoaderCircle } from "lucide-react";

import { useDockview } from "../contexts/DockviewContext.bak";
import DockviewReader from "./DockviewReader";

export type RenderBayViewProps = {
  className: string;
};

export default function DockviewView({ className = "" }: RenderBayViewProps) {
  const { showExplorer, activeVersion, projectName } = useDockview();

  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const iframe = iframeRef.current!;

    const srcUrl = `/vault/${projectName}/${activeVersion}/live`;
    iframe.src = srcUrl;
  }, [projectName, activeVersion]);

  // const ActiveComponent = loadComponent(nodeToLoad.module, moduleName);

  return (
    <div className="relative h-[70%] z-[10]">
      <Suspense
        fallback={
          <div className="flex justify-center gap-2 items-center h-full w-full">
            <LoaderCircle className="animate-spin" />
            Loading...
          </div>
        }
      >
        <iframe
          id="fake-root"
          ref={iframeRef}
          title={`${projectName}-${activeVersion}`}
          className={clsx(
            `translate-x-0 z-[10] transition-transform bg-white h-full w-full not-prose transition ${className}`,
            {
              "translate-x-[-100%]": showExplorer,
            }
          )}
        />
      </Suspense>
      <DockviewReader />
    </div>
  );
}
