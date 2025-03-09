import { AppContainer } from "~/container"

export abstract class BaseController {
    #container: AppContainer

    constructor(container: AppContainer) {
        this.#container = container
    }
}