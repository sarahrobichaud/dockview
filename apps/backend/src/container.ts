import { InstanceServiceContract } from "./services/interfaces/InstanceServiceContract.js"
import { VaultServiceContract } from "./services/interfaces/VaultServiceContract.js"
import { SetupServiceContract } from "./services/interfaces/SetupServiceContract.js"
import { DockerServiceContract } from "./services/interfaces/DockerServiceContract.js"
import { HealthServiceContract } from "./services/interfaces/HealthServiceContract.js"
import { InstanceManager } from "./lib/instance-manager/InstanceManager.js"
import { VaultService } from "./services/infrastructure/VaultService.js"
import { HealthService } from "./services/infrastructure/HealthService.js"
import { DockerService } from "./services/infrastructure/DockerService.js"
import { VaultRepository } from "./repository/infrastructure/VaultRepository.js"
import { VaultRepositoryContract } from "./repository/interfaces/VaultRepositoryContract.js"
import { VaultReader } from "./lib/vault-reader/VaultReader.js"
import { ProjectAnalyzerContract } from "./lib/project-analyzer/ProjectAnalyzerContract.js"
import { ProjectAnalyzer } from "./lib/project-analyzer/ProjectAnalyzer.js"
import { VaultReaderContract } from "./lib/vault-reader/VaultReaderContract.js"
import { VaultWriterContract } from "./lib/vault-writer/VaultWriterContract.js"
import { VaultWriter } from "./lib/vault-writer/VaultWriter.js"
import { InstanceService } from "./services/infrastructure/InstanceService.js"
import { SetupService } from "./services/infrastructure/SetupService.js"
import { WSInstanceEventEmitter } from "./services/infrastructure/WSInstanceEventEmitter.js"
import { DockviewWSServer } from "@dockview/ws/server"
import { DockviewInstance } from "@dockview/core/models"



export interface AppContainer {
    services: AppServices,
    managers: AppManagers,
    analyzers: AppAnalyzers,
    repositories: AppRepositories,
    io: AppIO,
    eventEmitter: WSInstanceEventEmitter
}

export interface AppRepositories {
    vault: VaultRepositoryContract
}

export interface AppAnalyzers {
    project: ProjectAnalyzerContract
}

export interface AppManagers {
    instance: InstanceManager
}

export interface AppServices {
    instance: InstanceServiceContract
    vault: VaultServiceContract
    setup: SetupServiceContract
    docker: DockerServiceContract
    health: HealthServiceContract
    eventEmitter: WSInstanceEventEmitter;
}

export interface AppIO {
    vaultReader: VaultReaderContract
    vaultWriter: VaultWriterContract
}

export function createContainer(wsServer: DockviewWSServer): AppContainer {

    const container = {
        services: {} as AppServices,
        managers: {} as AppManagers,
        analyzers: {} as AppAnalyzers,
        repositories: {} as AppRepositories,
        io: {} as AppIO,
        eventEmitter: new WSInstanceEventEmitter(wsServer)
    } as AppContainer;

    registerIO(container);
    registerAnalyzers(container);
    registerManagers(container);

    container.managers.instance.eventEmitter = container.eventEmitter;

    registerRepositories(container);
    registerServices(container);

    return container;
}

function registerServices(container: AppContainer): void {

    const { io, managers, repositories } = container;

    const dockerService = new DockerService(io.vaultWriter);
    const setupService = new SetupService(dockerService);
    const instanceService = new InstanceService(managers.instance, setupService, repositories.vault);
    const vaultService = new VaultService(repositories.vault);
    const healthService = new HealthService(instanceService);

    container.services.docker = dockerService;
    container.services.setup = setupService;
    container.services.instance = instanceService;
    container.services.vault = vaultService;
    container.services.health = healthService;
}

function registerRepositories(container: AppContainer): void {
    container.repositories.vault = new VaultRepository(container.io.vaultReader, container.analyzers.project);
}

function registerManagers(container: AppContainer): void {

    const instanceStorage = new Map<string, DockviewInstance>();
    const projectStorage = new Map<string, Set<string>>();

    container.managers.instance = new InstanceManager(instanceStorage, projectStorage);
}

function registerAnalyzers(container: AppContainer): void {

    container.analyzers.project = new ProjectAnalyzer(container.io.vaultReader);
}

function registerIO(container: AppContainer): void {

    const vaultReader = new VaultReader("./harborvault");
    const vaultWriter = new VaultWriter(vaultReader);

    container.io.vaultReader = vaultReader;
    container.io.vaultWriter = vaultWriter;
}