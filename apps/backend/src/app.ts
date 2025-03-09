import cors from 'cors'
import express, { Application } from 'express'
import morgan from 'morgan'
import type { Server } from 'node:http'
import vhost from 'vhost'
import { AppContainer } from './container'
import { VaultRouter } from './routes/vault.router'

import path, { dirname } from "node:path"
import { fileURLToPath } from "node:url"
import { InstanceRouter } from './routes/instance.router'
import { ProxyRouter } from './routes/proxy.router'
import { DockviewApp } from './infrastructure/DockviewAppDockviewApp'


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



