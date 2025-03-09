import { AppContainer } from "~/container.js"
import { AppContext } from "~/infrastructure/BaseRouter.js"

export abstract class BaseController {

    #context: AppContext

    constructor(context: AppContext) {
        this.#context = context
    }

    get services() {
        return this.#context.container.services
    }
}