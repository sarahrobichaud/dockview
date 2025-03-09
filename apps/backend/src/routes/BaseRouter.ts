import { Application, Router } from "express"
import { AppContainer } from "~/container"
import { BaseController } from "~/controllers/BaseController"
import { responses } from "~/middlewares/response.middleware"
import { RouteHandler, RouterConfiguration, RouteRegistration } from "~/types/router"

export interface AppContext {
    app: Application,
    container: AppContainer
}

export class BaseRouter {
    #self: Router
    #prefix: string
    #app: Application


    constructor(config: RouterConfiguration, context: AppContext) {
        this.#self = Router()
        this.#prefix = config.prefix
        this.#app = context.app
    }

    protected before(): void {
        this.#app.use(responses.format)
    }

    protected after() {
        this.#app.use(responses.handleErrors)
    }

    protected register(registration: RouteRegistration) {
        if (Array.isArray(registration.handler)) {
            this.#self[registration.method](registration.path, ...registration.handler)
        } else {
            this.#self[registration.method](registration.path, registration.handler)
        }
    }

    registerRoutes(): void {
        throw new Error("You must implement registerRoutes()")
    }

    get prefix(): string {
        return this.#prefix
    }

    init() {

        this.#app.use(responses.format)

        this.before()

        this.registerRoutes()

        this.#app.use(this.#prefix, this.#self)

        this.after()

    }
}