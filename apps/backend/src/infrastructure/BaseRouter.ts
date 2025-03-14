import { Application, RequestHandler, Router } from "express"
import { AppContainer } from "~/container.js"
import { responses } from "~/middlewares/response.middleware.js"
import { RouterConfiguration, RouteRegistration } from "~/types/router.js"

export interface AppContext {
    app: Application,
    container: AppContainer
}

export interface Middleware {
    path: string | null,
    middleware: RequestHandler
}

export class BaseRouter {
    #self: Router
    #prefix: string
    #app: Application

    #beforeMiddlewares: Middleware[] = []
    #afterMiddlewares: Middleware[] = []

    constructor(config: RouterConfiguration, context: AppContext) {
        this.#self = Router()
        this.#prefix = config.prefix
        this.#app = context.app
    }

    protected useBefore(middleware: RequestHandler, path: string | null = null): void {
        this.#beforeMiddlewares.push({ path, middleware })
    }

    protected useAfter(middleware: RequestHandler, path: string | null = null): void {
        this.#afterMiddlewares.push({ path, middleware })
    }

    protected before(): void {
        this.#app.use(responses.format)
        this.#beforeMiddlewares.forEach(this.applyMiddleware.bind(this))
    }

    protected after() {
        this.#afterMiddlewares.forEach(this.applyMiddleware.bind(this))
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
        this.before()

        this.registerRoutes()

        this.#app.use(this.#prefix, this.#self)

        this.after()
    }

    private applyMiddleware({ path, middleware }: Middleware) {
        if (path !== null) {
            this.#app.use(path, middleware)
        } else {
            console.log("Applying middleware to all paths", middleware)
            this.#app.use(middleware)
        }
    }
}