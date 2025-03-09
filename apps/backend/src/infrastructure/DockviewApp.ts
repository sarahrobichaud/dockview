import express from 'express';
import path from 'path';
import { __dirname } from '~/app.js';
import { AppContainer } from '~/container.js';
import { AppContext, BaseRouter } from './BaseRouter.js';



export abstract class DockviewApp {

    #context: AppContext;
    #routers: BaseRouter[] = [];

    constructor(container: AppContainer) {
        this.#context = {
            app: express(),
            container: container
        };
    }

    get context(): AppContext {
        return this.#context;
    }

    registerRouter(router: BaseRouter): void {
        this.#routers.push(router);
    }

    init(): void {
        console.log("Initializing module", this.constructor.name);
        this.setupViewEngine();
        for (const router of this.#routers) {
            console.log("Initializing router", router.constructor.name);
            router.init();
        }
    }

    setupViewEngine(): void {
        this.context.app.set("view engine", "ejs");

        const viewsDir = path.resolve(__dirname, "views");
        this.context.app.set("views", viewsDir);
    }
}
