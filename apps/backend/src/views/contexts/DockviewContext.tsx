import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

import type { PropsWithChildren } from "react";
import { FileNode } from "~/lib/filetree-builder/filetree.js";

export type DockviewContextType = {
  activeVersion: null | string;
  showExplorer: boolean;
  unsupportedFile: boolean;
  activeFile: null | FileNode;
  loading: boolean;
  loadingFile: boolean;
  isFullScreen: boolean;
  fileContent: string | null;
  toggleFullScreen: () => void;
  toggleExplorer: () => void;
  selectFile: (file: FileNode | null) => void;
  getCurrentFileName: () => string;
};

const DockviewCTX = createContext<DockviewContextType>({
  activeVersion: null,
  showExplorer: false,
  unsupportedFile: false,
  loading: true,
  activeFile: null,
  loadingFile: false,
  isFullScreen: false,
  fileContent: null,
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
  const [loadingFile, setLoadingFile] = useState(false);
  const [unsupportedFile, setUnsupportedFile] = useState(false);

  useEffect(() => {
    if (activeFile) {
      setUnsupportedFile(false);
      setLoadingFile(true);
      fetchFileContent();
    }
  }, [activeFile]);


  function selectFile(file: FileNode | null) {
    console.log({ file });
    setActiveFile(file);
  }

  async function fetchFileContent() {
    try {
      // Clear previous content and show loading state
      setFileContent(null);
      setLoadingFile(true);

      // Start fetch in background
      const contentPromise = fetch(`/file?path=${activeFile?.path}`)
        .then(res => {
          if (!res.ok) {
            if (res.status === 415) {
              setUnsupportedFile(true);
              return null
            }
            throw new Error("Failed to fetch file content");
          }
          return res.json();
        })
        .then((res) => res ? res.data : null);

      // Add small delay to show loading state for better UX
      const delayPromise = new Promise(resolve => setTimeout(resolve, 200));

      // Wait for both promises in parallel
      const [content] = await Promise.all([contentPromise, delayPromise]);

      // Update state with new content
      setFileContent(content);
    } catch (err) {
      console.error('Error fetching file content:', err);
      setFileContent(null);
    } finally {
      setLoadingFile(false);
    }
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
        loadingFile,
        unsupportedFile,
        showExplorer,
        isFullScreen,
        loading,
        fileContent,
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
