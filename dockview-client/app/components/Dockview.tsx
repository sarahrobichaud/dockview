import React from "react";
import clsx from "clsx";
import { useMemo, type PropsWithChildren } from "react";

import DockviewView from "./DockviewView";
import DockviewTopNav from "./navigation/DockviewTopNav";
import DockviewBottomNav from "./navigation/DockviewBottomNav";

import { useDockview, DockviewProvider } from "../contexts/DockviewContext.bak";

import { Loader } from "lucide-react";

import "./dockview.css";

export default function DockviewApp({ project }: { project: string }) {
  return (
    <DockviewProvider
      projectName={project}
      maxVersion="0.0.8"
      minVersion="0.0.7"
    >
      <Dockview />
    </DockviewProvider>
  );
}

function DockviewContainer({ children }: PropsWithChildren) {
  const { isFullScreen, toggleFullScreen, showExplorer } = useDockview();
  return (
    <div
      onClick={() => isFullScreen && toggleFullScreen()}
      className={clsx(
        "w-full min-w-[344px] transition duration-500 transition hover:shadow-lg",
        {
          "bg-gray-200/0": showExplorer,
          "bg-gray-200/100": !showExplorer,
          "relative border-gray-300 border rounded-xl": !isFullScreen,
          "!fixed inset-0 z-[1000]": isFullScreen,
        }
      )}
    >
      {children}
    </div>
  );
}

function DockviewWindow({ children }: PropsWithChildren) {
  const { isFullScreen, loading } = useDockview();
  return (
    <DockviewContainer>
      {loading ? (
        <p className="my-0 flex gap-2 font-2xl items-center px-4 subtitle text-charcoal py-8">
          <Loader className="animate-spin" />
          Render <span className="font-2xl py-0 my-0">Wave</span>
        </p>
      ) : (
        <div
          onClick={(e) => {
            e.stopPropagation();
          }}
          className={clsx("overflow-hidden ", {
            "h-[700px] max-h-[700px] w-full rounded-xl": !isFullScreen,
            "h-screen w-screen": isFullScreen,
          })}
        >
          {children}
        </div>
      )}
    </DockviewContainer>
  );
}

function Dockview() {
  return (
    <DockviewWindow>
      <DockviewTopNav />
      <DockviewView className="" />
      <DockviewBottomNav />
    </DockviewWindow>
  );
}
