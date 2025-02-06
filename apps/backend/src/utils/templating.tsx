import React from "react";
import ReactDOMServer from "react-dom/server";

export type RenderOptions = {
    title: string;
    component: React.ReactNode;
    hydrateScript?: string;
    css?: string[]
    scripts?: string[];
}

export const render = (options: RenderOptions) => {

    const { title, component, hydrateScript, css, scripts } = options;

    const html = ReactDOMServer.renderToString(component);

    const baseURL = `${process.env.API_URL}`;

    console.log({html});

    const template = `
        <!DOCTYPE html>
        <html class="dark">
            <head>
                <title>${title}</title>

                ${css && css.length > 0 ? css.map(css => `<link rel="stylesheet" href="${baseURL}/${css}">`).join("\n") : ""}
                ${scripts && scripts.length > 0 ? scripts.map(script => `<script src="${baseURL}/${script}"></script>`).join("\n") : ""}
            </head>
            <body>
                <div id="root">${html}</div>
                ${hydrateScript ? `<script src="${baseURL}/${hydrateScript}"></script>` : ""}
            </body>
        </html>
    `;

    return template;
}