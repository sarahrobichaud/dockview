# Dockview

## Local Development

Run

```shell
docker compose up --build -d
```

This will start build and start up the two main services.

If can use the `--build` flag if you need to rebuild.

else if you are already setup just do:

```shell
docker compose up -d
```

`-d` is to detach it from your current shell.

### Client (Remix app)

You can remote into this with:

```shell
docker compose exec client bash
```

From the container in /app:

```shell
npm install
```

### Websocket library

> This is jank for now.

This is being used in `docker-service` via a direct file install (for now). Make sure you build the library.

```shell
npm run build
```

The bundled client file is kept in version control but if you make changes to the library, make sure to rebundle the script being served.

In the services' package.json:

```shell
npm run build:client-script
```

This takes `src/scripts/client.js` and outputs a bundled version to `public/dockview-client.js`.

This is not setup to run in container so do as you wish when it comes to development.


### Service (Node Express)

You can remote into this with:

```shell
docker compose exec backend bash
```

From the container in /app:

> Important to install from the container as it relies on a file install for the websocket library for now.

```shell
npm install
```


