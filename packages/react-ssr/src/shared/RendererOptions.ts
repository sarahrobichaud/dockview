import { Request, Response } from "express";

export interface AssetMap {
    [key: string]: string;
}


export interface SSROptions {

    streaming?: boolean;

    timeout?: number;

    assetMap: AssetMap;

    onError?: (error: Error, req: Request, res: Response) => void;
    onShellReady?: (req: Request, res: Response) => void;
    onAllReady?: (req: Request, res: Response) => void;
}

export type DocumentOptions = {
    title: string;
    assets: AssetMap;
    description: string;
    meta?: {
        [key: string]: string;
    },
    scripts?: string[],
    styles?: string[],
    htmlAttributes?: Record<string, string>;
    bodyAttributes?: Record<string, string>;
    headAttributes?: Record<string, string>;
}

export type RenderDocumentOptions = SSROptions & {
    document: DocumentOptions;
}