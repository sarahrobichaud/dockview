import { type PropsWithChildren } from "react";

import DockviewView from "./DockviewView.js";

import { useDockview, DockviewProvider } from "../contexts/DockviewContext.js";

import DockviewTopNav from "./navigation/DockviewTopNav.js";
import DockviewBottomNav from "./navigation/DockviewBottomNav.js";


export default function DockviewApp({
  backendURL,
  name,
}: {
  backendURL: string;
  name: string;
}) {
  return (
    <DockviewProvider>
      <Dockview backendURL={backendURL} name={name} />
    </DockviewProvider>
  );
}

function DockviewContainer({ children }: PropsWithChildren) {
  const { isFullScreen, toggleFullScreen, showExplorer } = useDockview();
  return (
    <div
      onClick={() => isFullScreen && toggleFullScreen()}
    >
      {children}
    </div>
  );
}

function DockviewWindow({ children }: PropsWithChildren) {
  const { isFullScreen, loading } = useDockview();
  return (
    <DockviewContainer>
      <div
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        {children}
      </div>
    </DockviewContainer>
  );
}

function Dockview({ backendURL, name }: { backendURL: string, name: string }) {
  console.log({ backendURL });
  return (
    <DockviewWindow>
      <DockviewTopNav name={name} />
      <DockviewView className="" backendURL={backendURL} />
      <DockviewBottomNav />
    </DockviewWindow>
  );
}
