import { useDockview } from "../contexts/DockviewContext.js";

import { TypoLead } from "@dockview/ui/typography";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { FileNode, FolderNode } from "~/lib/filetree-builder/filetree.js";
import DockviewFileBrowser from "./DockviewFileBrowser.js";

// @ts-ignore
import oneDark from "react-syntax-highlighter/dist/esm/styles/prism/one-dark.js";


export default function DockviewReader() {

    const [files, setFiles] = useState<(FileNode | FolderNode)[]>([]);
    const [text, setText] = useState<string | null>("console.log('Hello, world!');");

    const { activeFile, showExplorer, isFullScreen, fileContent, loadingFile, unsupportedFile } = useDockview();

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
        const languageMap: Record<string, string> = {
            // JavaScript & TypeScript
            'ts': 'typescript',
            'tsx': 'typescript',
            'js': 'javascript',
            'jsx': 'javascript',
            'mjs': 'javascript',
            'cjs': 'javascript',

            // Web
            'html': 'html',
            'htm': 'html',
            'css': 'css',
            'scss': 'scss',
            'sass': 'scss',
            'less': 'less',
            'json': 'json',
            'xml': 'xml',
            'svg': 'svg',

            // Backend
            'py': 'python',
            'rb': 'ruby',
            'php': 'php',
            'java': 'java',
            'cs': 'csharp',
            'go': 'go',
            'rs': 'rust',

            // Shell & Config
            'sh': 'bash',
            'bash': 'bash',
            'yaml': 'yaml',
            'yml': 'yaml',
            'toml': 'toml',
            'ini': 'ini',
            'env': 'plaintext',

            // Documentation
            'md': 'markdown',
            'mdx': 'markdown',
            'txt': 'plaintext',
        };

        const extension = fileName.split('.').pop()?.toLowerCase() || '';
        return languageMap[extension] || 'plaintext';
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
                {activeFile && unsupportedFile && (
                    <div
                        className={clsx(
                            "bg-card text-card-foreground h-full flex justify-center items-center pointer-events-none w-full",
                        )}
                    >
                        <TypoLead>
                            Unsupported file type
                        </TypoLead>
                    </div>
                )}
                {activeFile && !unsupportedFile && (
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

