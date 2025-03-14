import { RenderDocumentOptions } from "~/shared/RendererOptions";
import { Request, Response, NextFunction } from "express";
import { handleReactSSR as createReactSSRHandler } from "./middleware";
import { createElement } from "react";
import { customDocument } from "./renderers";

export function renderDocument<T extends object = {}>(options: { Component: React.ComponentType<any>, props: T } & RenderDocumentOptions) {

    const { document, Component, props, ...ssrOptions } = options;

    const element = createElement(Component, props)


    return (req: Request, res: Response, next: NextFunction) => {


        const handler = createReactSSRHandler(
            customDocument(element, document, props),
            {
                ...ssrOptions
            }
        )

        return handler(req, res, next);
    }
}