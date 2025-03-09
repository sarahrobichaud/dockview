import 'reflect-metadata'
import { createContainer } from "~/container"
import { createServer } from "~/app"

export async function init() {
    try {
        // Starting the HTTP server
        console.info('Starting HTTP server')

        const port = Number(process.env.PORT) || 8080
        const container = createContainer()
        const app = createServer(container)

        app.listen(port)
        console.info(`Application running on port: ${port}`)
    } catch (e) {
        console.error(e, 'An error occurred while initializing application.')
    }
}

init();