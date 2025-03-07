import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

import type { PropsWithChildren } from "react";
import { FileNode } from "~/lib/filetree-builder/filetree";

export type DockviewContextType = {
  activeVersion: null | string;
  showExplorer: boolean;
  activeFile: null | FileNode;
  loading: boolean;
  isFullScreen: boolean;
  toggleFullScreen: () => void;
  toggleExplorer: () => void;
  selectFile: (file: FileNode | null) => void;
  getCurrentFileName: () => string;
};

const DockviewCTX = createContext<DockviewContextType>({
  activeVersion: null,
  showExplorer: false,
  loading: true,
  activeFile: null,
  isFullScreen: false,
  toggleFullScreen: () => null,
  toggleExplorer: () => null,
  selectFile: () => null,
  getCurrentFileName: () => "",
});

export type DockviewProviderProps = {
} & PropsWithChildren;


const DockviewProvider = ({
  children,
}: DockviewProviderProps) => {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [showExplorer, setShowExplorer] = useState(false);

  const [activeFile, setActiveFile] = useState<FileNode | null>(null);
  const [activeVersion, setActiveVersion] = useState<null | string>(null);

  const [loading, setLoading] = useState(false);
  const lastYPos = useRef(0);

  const [fileContent, setFileContent] = useState<string | null>(null);

  useEffect(() => {

  }, [activeFile]);


  function selectFile(file: FileNode | null) {
    console.log({ file });
    setActiveFile(file);
  }

  function toggleExplorer() {
    setShowExplorer((prev) => !prev);
  }

  function getCurrentFileName() {
    if (!activeFile) {
      return "No file selected.";
    }
    const splitted = activeFile.path.split("/");

    return splitted[splitted.length - 1];
  }

  function toggleFullScreen() {
    if (!isFullScreen) lastYPos.current = window.scrollY;

    document.body.classList.toggle("rw-fullscreen");

    if (isFullScreen) {
      window.scroll(0, lastYPos.current);
    }

    setIsFullScreen((prev) => !prev);
  }

  // Clean this up

  return (
    <DockviewCTX.Provider
      value={{
        activeVersion,
        activeFile,
        showExplorer,
        isFullScreen,
        loading,
        toggleFullScreen,
        toggleExplorer,
        selectFile,
        getCurrentFileName,
      }}
    >
      {children}
    </DockviewCTX.Provider>
  );
};

const useDockview = () => {
  const ctx = useContext(DockviewCTX);

  if (!ctx) throw new Error("Dockview must be used within its provider.");

  return ctx;
};

export { DockviewProvider, useDockview };
