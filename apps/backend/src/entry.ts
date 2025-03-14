import { createContainer } from "~/container.js"
import { createServer } from "~/app.js"
import { DockviewWSServer } from '@dockview/ws/server'
import { registerWSHandlers } from './ws.js'

export async function init() {
    try {
        // Starting the HTTP server
        console.info('Starting HTTP server')

        const mode = process.env.NODE_ENV || "development"
        console.info("Running in ", process.env.NODE_ENV, " mode")

        const port = Number(process.env.PORT) || 4100



        const wsServer = DockviewWSServer.create(8080);

        const container = createContainer(wsServer)

        const app = createServer(container)

        registerWSHandlers({ server: wsServer, container });

        app.listen(port)
        console.info(`Application running on port: ${port}`)
    } catch (e) {
        console.error(e, 'An error occurred while initializing application.')
    }
}

init();