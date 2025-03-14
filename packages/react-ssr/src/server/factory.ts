import { RenderDocumentOptions } from "~/shared/RendererOptions";
import { Request, Response, NextFunction } from "express";
import { handleReactSSR as createReactSSRHandler } from "./middleware";
import React = require("react");
import { customDocument } from "./renderers";

export function renderDocument<T extends object = {}>(Component: React.ComponentType<any>, props: T, options: RenderDocumentOptions) {

    const { document, ...ssrOptions } = options;

    const element = React.createElement(Component, props)


    return (req: Request, res: Response, next: NextFunction) => {

        const handler = createReactSSRHandler(
            customDocument(element, document),
            ssrOptions
        )

        return handler(req, res, next);
    }
}