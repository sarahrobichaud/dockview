import { ReactNode } from "react";
import { NextFunction, Request, Response } from "express";
import { renderToPipeableStream } from "react-dom/server";


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

export function createReactSSRMiddleware(
    render: () => ReactNode,
    options: SSROptions
) {

    const { streaming, timeout = 10000, assetMap = [], onError, onShellReady, onAllReady } = options;

    return async (req: Request, res: Response, next: NextFunction) => {

        let timeoutId: NodeJS.Timeout | undefined;

        try {

            const app = render();

            const { pipe, abort } = renderToPipeableStream(app, {
                bootstrapScripts: [],
                onShellReady() {
                    clearTimeout(timeoutId);

                    res.setHeader("Content-Type", "text/html");

                    if (onShellReady) {
                        onShellReady(req, res);
                    }

                    if (streaming) {
                        pipe(res);
                    }
                },
                onAllReady() {
                    clearTimeout(timeoutId);

                    // Custom all ready callback
                    if (onAllReady) {
                        onAllReady(req, res);
                    }

                    // If not streaming, wait until everything is ready
                    if (!streaming) {
                        pipe(res);
                    }
                },
                onError(error) {
                    clearTimeout(timeoutId);

                    // Handle errors
                    if (onError) {
                        onError(error as Error, req, res);
                    } else {
                        console.error('Error during SSR:', error);
                        if (!res.headersSent) {
                            res.status(500).send('Internal Server Error');
                        } else {
                            abort();
                            res.end();
                        }
                    }
                }
            })

            timeoutId = setTimeout(() => {
                abort();
                next()
            }, timeout);

            req.on("close", () => {
                clearTimeout(timeoutId);
                next()
            })
        } catch (error) {
            clearTimeout(timeoutId);
            next(error);
        }
    }
}