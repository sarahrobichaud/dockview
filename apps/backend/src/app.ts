import express, { Router } from 'express'
import type { Server } from 'node:http'
import cors from 'cors'
import { Application } from 'express'
import { AppContainer } from './container'
import morgan from 'morgan'
import { responses } from './middlewares/response.middleware'
import vhost from 'vhost'
import { AppContext, BaseRouter } from './routes/BaseRouter'
import { VaultRouter } from './routes/vault.router'
import fs from 'node:fs'

import path, { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { RouterConfiguration } from './types/router'


export const __dirname = path.join(dirname(fileURLToPath(import.meta.url)));


export class AppServer {
    #app: Application
    #server: Server | undefined

    constructor(app: Application) {
        this.#app = app
    }

    public listen(port: number): Server {
        this.#server = this.#app.listen(port)
        return this.#server
    }

    public get server(): Server {
        if (!this.#server) {
            throw new Error("Trying to access server before it has been started")
        }

        return this.#server
    }
}

export function createServer(container: AppContainer): AppServer {
    const app = express()
    const server = new AppServer(app)

    const host = process.env.DOMAIN || "localhost"

    const vaultModule = new VaultModule(container)

    vaultModule.registerRouter(new VaultRouter(vaultModule.context))

    // Register Middlewares
    app.use(cors());
    app.use(express.static('public'))
    app.use(morgan('dev'))

    vaultModule.init()

    // Subdomain Routing
    app.use(vhost(`api.${host}`, vaultModule.context.app))
    app.use(vhost(`backend`, vaultModule.context.app))

    return server
}


export abstract class DockviewModule {

    #context: AppContext
    #routers: BaseRouter[] = []

    constructor(container: AppContainer,) {
        this.#context = {
            app: express(),
            container: container
        }
    }

    get context(): AppContext {
        return this.#context
    }

    registerRouter(router: BaseRouter): void {
        this.#routers.push(router)
    }

    init(): void {
        console.log("Initializing module", this.constructor.name)
        this.setupViewEngine()
        for (const router of this.#routers) {
            console.log("Initializing router", router.constructor.name)
            router.init()
        }
    }

    setupViewEngine(): void {
        this.context.app.set("view engine", "ejs");

        const viewsDir = path.resolve(__dirname, "views")
        this.context.app.set("views", viewsDir);
    }
}


class VaultModule extends DockviewModule { }


