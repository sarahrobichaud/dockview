import cors from 'cors'
import {createReactSSRMiddleware} from "@dockview/react-ssr"
import express, { Application, Request, Response } from 'express'
import morgan from 'morgan'
import type { Server } from 'node:http'
import vhost from 'vhost'
import { AppContainer } from './container.js'
import { VaultRouter } from './routes/vault.router.js'

import path, { dirname } from "node:path"
import { fileURLToPath } from "node:url"
import { InstanceRouter } from './routes/instance.router.js'
import { ProxyRouter } from './routes/proxy.router.js'
import { DockviewApp } from './infrastructure/DockviewApp.js'
import { AppContext, BaseRouter } from './infrastructure/BaseRouter.js'
import { Method, RouteHandler } from './types/router.js'
import { StatusView } from './client/pages/Status.js'
import { DockviewInstancePublicDTO } from '@dockview/core/models'


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

class VaultModule extends DockviewApp { }
class ProxyModule extends DockviewApp { }
class InstanceModule extends DockviewApp { }

export function createServer(container: AppContainer): AppServer {

    const app = express()
    const server = new AppServer(app)

    const host = process.env.DOMAIN || "localhost"

    const vaultModule = new VaultModule(container)
    const proxyModule = new ProxyModule(container)
    const instanceModule = new InstanceModule(container)

    vaultModule.registerRouter(new VaultRouter(vaultModule.context))
    vaultModule.registerRouter(new ReactTestModuleRouter(vaultModule.context))
    proxyModule.registerRouter(new ProxyRouter(proxyModule.context))
    instanceModule.registerRouter(new InstanceRouter(instanceModule.context))
    // Register Middlewares
    app.use(cors());
    app.use(express.static('public'))
    app.use(morgan('dev'))

    vaultModule.init()
    proxyModule.init()
    instanceModule.init()

    // Subdomain Routing
    app.use(vhost(`api.${host}`, vaultModule.context.app))
    app.use(vhost(`backend`, vaultModule.context.app))
    app.use(vhost(`proxy.*.${host}`, proxyModule.context.app))
    app.use(vhost(`*.${host}`, instanceModule.context.app))

    return server
}

class ReactTestModuleRouter extends BaseRouter {

    #ssrMiddleware: RouteHandler;

    constructor(context: AppContext) {
        super({prefix: "/react-test"},context)


        this.#ssrMiddleware =  createReactSSRMiddleware(
            () => <StatusView test="Hello World" />,
            {
                assetMap:{},
                timeout: 5000,
            }
        )
    }

    registerRoutes(): void {
        this.register({
            path: "*",
            method: Method.GET,
            handler: this.#ssrMiddleware
        })
    }
}



