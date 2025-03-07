import { useDockview } from "../contexts/DockviewContext";

import clsx from "clsx";
import { useEffect, useState } from "react";
import { FileNode, FolderNode } from "~/lib/filetree-builder/filetree";
import DockviewFileBrowser from "./DockviewFileBrowser";
import { Loader2 } from "@dockview/ui/components/icons/index";
import { TypoLead } from "@dockview/ui/typography";
import { useAnimatedText } from "@dockview/ui/hooks";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";

import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";


export default function DockviewReader() {

    const [files, setFiles] = useState<(FileNode | FolderNode)[]>([]);
    const [text, setText] = useState<string | null>("console.log('Hello, world!');");

    const { activeFile, showExplorer, isFullScreen, fileContent, loadingFile } = useDockview();

    useEffect(() => {
        const fetchFiles = async (): Promise<FileNode[]> => {
            const files = await fetch("/files");
            const { data } = await files.json();
            setFiles(data);
            return data;
        }

        fetchFiles();
    }, []);

    const getLanguage = (fileName: string) => {

        console.log({ fileName });

        if (fileName.endsWith(".tsx") || fileName.endsWith(".ts"))
            return "typescript";
        if (fileName.endsWith(".jsx") || fileName.endsWith(".js"))
            return "javascript";
        if (fileName.endsWith(".css")) return "css";
        if (fileName.endsWith(".html")) return "html";
        return "plaintext";
    };

    return (
        <div
            className={clsx(
                "absolute inset-0 z-[-1] bg-background text-background-foreground transition-transform flex top-[80px] bottom-[calc(10vh-80px)]",
                {
                    "max-w-[100%]": showExplorer && !isFullScreen,
                }
            )}
        >
            <DockviewFileBrowser files={files} showExplorer={showExplorer} />

            <div className={clsx(
                "flex-1 h-full",
            )}>
                {!activeFile && (
                    <div
                        className={clsx(
                            "bg-card text-card-foreground h-full flex justify-center items-center pointer-events-none w-full",
                        )}
                    >
                        <TypoLead>
                            Please select a file
                        </TypoLead>
                    </div>
                )}
                {activeFile && (
                    <div
                        style={{ scrollbarGutter: "stable" }}
                        className="relative h-full w-full"
                    >
                        {fileContent && (
                            <SyntaxHighlighter
                                showLineNumbers
                                style={oneDark}
                                customStyle={{
                                    position: "absolute",
                                    inset: "0",
                                    scrollbarGutter: "stable",
                                    overflowY: "scroll",
                                    overflowX: "auto",
                                    width: "100%",
                                    height: "100%",
                                    maxHeight: "100%",
                                }}
                                lineNumberStyle={
                                    {
                                        minWidth: "30px",
                                        textAlign: "right",
                                    }
                                }
                                language={getLanguage(activeFile.path)}
                            >
                                {fileContent}
                            </SyntaxHighlighter>)}
                    </div>
                )}
            </div>
        </div >
    )
}

