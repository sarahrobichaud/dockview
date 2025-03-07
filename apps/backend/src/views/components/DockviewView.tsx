import React, { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { Suspense } from "react";
import { LoaderCircle } from "@dockview/ui/icons";

import { useDockview } from "../contexts/DockviewContext";
import DockviewReader from "./DockviewReader";

export type RenderBayViewProps = {
  backendURL: string;
} & React.HTMLAttributes<HTMLDivElement>;

export default function DockviewView({
  className = "",
  backendURL,
}: RenderBayViewProps) {
  const { showExplorer, activeVersion, } = useDockview();

  return (
    <div className="relative h-[calc(90vh)] max-h-[calc(90vh)] pt-[80px] min-h-full z-[10]">
      <iframe
        id="fake-root"
        src={backendURL}
        className={clsx(
          `translate-x-0 z-[10] transition-transform bg-background h-full w-full not-prose ${className}`,
          {
            "translate-x-[-100%]": showExplorer,
          }
        )}
      />
      <DockviewReader />
    </div>
  );
}
