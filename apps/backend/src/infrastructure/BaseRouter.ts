import { Application, RequestHandler, Router } from "express"
import { AppContainer } from "~/container.js"
import { BaseController } from "~/infrastructure/BaseController.js"
import { responses } from "~/middlewares/response.middleware.js"
import { RouteHandler, RouterConfiguration, RouteRegistration } from "~/types/router.js"

export interface AppContext {
    app: Application,
    container: AppContainer
}

export class BaseRouter {
    #self: Router
    #prefix: string
    #app: Application

    #beforeMiddlewares: RequestHandler[] = []
    #afterMiddlewares: RequestHandler[] = []

    constructor(config: RouterConfiguration, context: AppContext) {
        this.#self = Router()
        this.#prefix = config.prefix
        this.#app = context.app
    }

    protected useBefore(middleware: RequestHandler): void {
        this.#beforeMiddlewares.push(middleware)
    }

    protected useAfter(middleware: RequestHandler): void {
        this.#afterMiddlewares.push(middleware)
    }

    protected before(): void {
        this.#app.use(responses.format)

        if (this.#beforeMiddlewares.length > 0) {
            this.#app.use(...this.#beforeMiddlewares)
        }
    }

    protected after() {

        if (this.#afterMiddlewares.length > 0) {
            this.#app.use(...this.#afterMiddlewares)
        }

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