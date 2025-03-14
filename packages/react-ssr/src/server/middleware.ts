import { ReactNode } from "react";
import { NextFunction, Request, Response } from "express";
import { renderToPipeableStream } from "react-dom/server";
import { SSROptions } from "~/shared/RendererOptions";

export function handleReactSSR(
    render: ReactNode,
    options: SSROptions
) {

    const { streaming, timeout = 10000, assetMap = [], onError, onShellReady, onAllReady } = options;

    return async (req: Request, res: Response, next: NextFunction) => {

        let timeoutId: NodeJS.Timeout | undefined;

        try {

            const { pipe, abort } = renderToPipeableStream(render, {
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

                    if (onAllReady) {
                        onAllReady(req, res);
                    }

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

                if (!res.headersSent) {
                    next(new Error("SSR Timeout"))
                }
            }, timeout);

        } catch (error) {
            clearTimeout(timeoutId);
            if (!res.headersSent) {
                next(error);
            }
        }
    }
}