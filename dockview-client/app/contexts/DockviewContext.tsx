import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

import type { PropsWithChildren } from "react";
import {
  type ProcessedFolder,
  type LoadedModule,
  type TreeNode,
} from "../utils/utils";
import VaultAPI from "../api/vault";
import { minVersion } from "semver";

export type DockviewContextType = {
  activeVersion: null | string;
  projectName: string;
  showExplorer: boolean;
  loading: boolean;
  isFullScreen: boolean;
  versions: string[];
  toggleFullScreen: () => void;
  toggleExplorer: () => void;
  selectFile: (file: LoadedModule | null) => void;
  selectVersion: (version: string) => void;
  getCurrentFileName: () => string;
};

const DockviewCTX = createContext<DockviewContextType>({
  activeVersion: null,
  showExplorer: false,
  loading: true,
  projectName: "",
  versions: [],
  isFullScreen: false,
  toggleFullScreen: () => null,
  toggleExplorer: () => null,
  selectFile: () => null,
  selectVersion: () => null,
  getCurrentFileName: () => "",
});

export type DockviewProviderProps = {
  projectName: string;
  minVersion: string;
  maxVersion: string;
} & PropsWithChildren;

type NodeVersionMap = {
  version: number;
  module: LoadedModule;
};

const DockviewProvider = ({
  children,
  projectName,
  maxVersion,
  minVersion,
}: DockviewProviderProps) => {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [showExplorer, setShowExplorer] = useState(false);

  const [activeFile, setActiveFile] = useState<LoadedModule | null>(null);
  const [activeVersion, setActiveVersion] = useState<null | string>(null);

  const [versions, setVersions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const lastYPos = useRef(0);

  useEffect(() => {
    async function fetchData() {
      const versions = await VaultAPI.fetchAvailableVersions(
        projectName,
        minVersion,
        maxVersion
      );

      console.log({ versions });
      setVersions(versions);
      setActiveVersion(versions[0]);
      setLoading(false);
    }
    fetchData();
  }, []);

  function selectFile(file: LoadedModule | null) {
    setActiveFile(file);
  }
  function selectVersion(version: string) {
    setActiveVersion(version);
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
        versions,
        showExplorer,
        isFullScreen,
        loading,
        toggleFullScreen,
        toggleExplorer,
        selectFile,
        selectVersion,
        projectName,
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
