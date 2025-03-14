import { ReactNode, cloneElement, createElement, isValidElement } from "react";
import { DocumentOptions } from "~/shared/RendererOptions";


export function customDocument(children: ReactNode, options: DocumentOptions, initialState: Record<string, any>) {

    const {
        title,
        assets,
        meta = {
            viewport: "width=device-width, initial-scale=1.0",
        },
        scripts = [],
        styles = [],
        htmlAttributes = { lang: "en" },
        bodyAttributes = {},
        headAttributes = {},
    } = options;

    const metaTags = Object.entries(meta).map(([name, content]) =>
        createElement('meta', { key: name, name, content })
    );

    const scriptTags = [
        createElement('script', {
            key: 'initial-state',
            dangerouslySetInnerHTML: {
                __html: `window.__INITIAL_STATE__ = ${JSON.stringify(initialState)};`
            }
        }),
        ...Object.values(assets)
            .filter(src => src.endsWith('.js'))
            .map(src => createElement('script', { key: src, src, defer: true, type: 'module' })),
        ...scripts.map(src => createElement('script', { key: src, src, defer: true, type: 'module' })),
    ];

    const styleTags = [
        ...Object.values(assets)
            .filter(href => href.endsWith('.css'))
            .map(href => createElement('link', { key: href, rel: 'stylesheet', href })),
        ...styles.map(href => createElement('link', { key: href, rel: 'stylesheet', href })),
    ];

    const head = createElement(
        'head',
        headAttributes,
        createElement('meta', { charSet: 'utf-8' }),
        ...metaTags,
        createElement('title', null, title),
        ...styleTags
    );

    const body = createElement(
        'body',
        bodyAttributes,
        createElement('div', { id: 'root' },
            isValidElement(children)
                ? cloneElement(children, initialState)
                : children,
        ),
        ...scriptTags
    );

    return createElement(
        'html',
        htmlAttributes,
        head,
        body
    );
}

