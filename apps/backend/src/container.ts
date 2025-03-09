import { InstanceServiceContract } from "./services/interfaces/InstanceServiceContract"
import { VaultServiceContract } from "./services/interfaces/VaultServiceContract"
import { SetupServiceContract } from "./services/interfaces/SetupServiceContract"
import { DockerServiceContract } from "./services/interfaces/DockerServiceContract"
import { HealthServiceContract } from "./services/interfaces/HealthServiceContract"
import { InstanceManager } from "./lib/instance-manager/InstanceManager"
import { VaultService } from "./services/infrastructure/VaultService"
import { HealthService } from "./services/infrastructure/HealthService"
import { DockerService } from "./services/infrastructure/DockerService"
import { VaultRepository } from "./repository/infrastructure/VaultRepository"
import { VaultRepositoryContract } from "./repository/interfaces/VaultRepositoryContract"
import { VaultReader } from "./lib/vault-reader/VaultReader"
import { ProjectAnalyzerContract } from "./lib/project-analyzer/ProjectAnalyzerContract"
import { ProjectAnalyzer } from "./lib/project-analyzer/ProjectAnalyzer"
import { VaultReaderContract } from "./lib/vault-reader/VaultReaderContract"
import { VaultWriterContract } from "./lib/vault-writer/VaultWriterContract"
import { VaultWriter } from "./lib/vault-writer/VaultWriter"
import { InstanceService } from "./services/infrastructure/InstanceService"
import { DockviewInstance } from "@dockview/core/models"
import { SetupService } from "./services/infrastructure/SetupService"


export interface AppContainer {
    services: AppServices,
    managers: AppManagers,
    analyzers: AppAnalyzers,
    repositories: AppRepositories,
    io: AppIO
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
}

export interface AppIO {
    vaultReader: VaultReaderContract
    vaultWriter: VaultWriterContract
}

export function createContainer(): AppContainer {

    const container = {
        services: {} as AppServices,
        managers: {} as AppManagers,
        analyzers: {} as AppAnalyzers,
        repositories: {} as AppRepositories,
        io: {} as AppIO
    } as AppContainer;

    registerIO(container);
    registerAnalyzers(container);
    registerManagers(container);
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