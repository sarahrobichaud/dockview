import { AppContainer } from "~/container"
import { AppContext } from "~/infrastructure/BaseRouter"

export abstract class BaseController {

    #context: AppContext

    constructor(context: AppContext) {
        this.#context = context
    }

    get services() {
        return this.#context.container.services
    }
}