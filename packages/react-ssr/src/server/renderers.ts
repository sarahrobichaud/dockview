import { ReactNode } from "react";
import React = require("react");
import { DocumentOptions } from "~/shared/RendererOptions";


export function customDocument(children: ReactNode, options: DocumentOptions) {

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
        React.createElement('meta', { key: name, name, content })
    );

    const scriptTags = [
        ...Object.values(assets)
            .filter(src => src.endsWith('.js'))
            .map(src => React.createElement('script', { key: src, src, defer: true })),
        ...scripts.map(src => React.createElement('script', { key: src, src, defer: true }))
    ];

    const styleTags = [
        ...Object.values(assets)
            .filter(href => href.endsWith('.css'))
            .map(href => React.createElement('link', { key: href, rel: 'stylesheet', href })),
        ...styles.map(href => React.createElement('link', { key: href, rel: 'stylesheet', href }))
    ];

    const head = React.createElement(
        'head',
        headAttributes,
        React.createElement('meta', { charSet: 'utf-8' }),
        ...metaTags,
        React.createElement('title', null, title),
        ...styleTags
    );

    const body = React.createElement(
        'body',
        bodyAttributes,
        React.createElement('div', { id: 'root' }, children, ...scriptTags)
    );

    return React.createElement(
        'html',
        htmlAttributes,
        head,
        body
    );
}

