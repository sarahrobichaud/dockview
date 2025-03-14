import { LoaderCircle } from "@dockview/ui/icons";
import clsx from "clsx";
import { useEffect, useState } from "react";

import { useDockview } from "../contexts/DockviewContext.js";
import DockviewReader from "./DockviewReader.js";

export type RenderBayViewProps = {
  backendURL: string;
} & React.HTMLAttributes<HTMLDivElement>;

export default function DockviewView({
  className = "",
  backendURL,
}: RenderBayViewProps) {
  const { showExplorer, activeVersion, } = useDockview();
  const [initialLoad, setInitialLoad] = useState(true);

  useEffect(() => {
    console.log({ activeVersion });
    const t = setTimeout(() => {
      setInitialLoad(false);
    }, 1000);
    return () => clearTimeout(t);
  }, [activeVersion]);

  return (
    <div className="relative h-[calc(90vh)] max-h-[calc(90vh)] pt-[80px] min-h-full z-[10]">
      <div className={clsx(
        "absolute inset-0 transition pointer-events-none duration-500 opacity-100 bg-background z-[10] flex justify-center items-center",
        {
          "!opacity-0": !initialLoad,
        }
      )}>
        <LoaderCircle className="animate-spin" />
      </div>
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
