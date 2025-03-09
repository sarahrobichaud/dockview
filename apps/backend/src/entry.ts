import { createContainer } from "~/container"
import { createServer } from "~/app"
import { DockviewWSServer } from '@dockview/ws/server'
import { registerWSHandlers } from './ws'

export async function init() {
    try {
        // Starting the HTTP server
        console.info('Starting HTTP server')

        const port = Number(process.env.PORT) || 8080

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