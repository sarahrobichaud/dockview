# Dockview

A system for serving containerized project instances on demand.

## Demo

[Demo of current functionality](https://www.youtube.com/watch?v=cKSDyBjaBWc)

## Current Functionality

#### Dockview View Instance Managment
- Request a project instance by version
- Project distribution layer
- Instances are shutdown after a grace period with no active connection

#### Instance View
- View and interact with a fully isolated production build of a project
- Project source code explorer with file tree and syntax highlighting
- Realtime active viewer count
- Realtime container logs during setup
- Sharable link

#### Project browser (pretty early UI)
- Browse available projects
- See available project versions
- View a project instance from the project browser

## Work in progress 🏗️

- IN PROGESS: Improving and extracting the react rendering logic from the backend app.
- TODO: Rewrite the small WS library (it was written a long time ago and I learned a lot since)
- TODO: Setup security things like CORS/RL etc.
- TODO: Add automated tests for core logic (instance manager)
- TODO: Move instance/project tracking to persistent storage
- TODO: User friendly vault configuration
- TODO: Performance optimization
