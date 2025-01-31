import { container, Lifecycle } from "tsyringe";

import { VaultReader } from "~/lib/vault-reader/VaultReader";
import { ProjectAnalyzer } from "~/lib/project-analyzer/ProjectAnalyzer";

import { VaultService } from "~/services/infrastructure/VaultService";
import { DockerService } from "~/services/infrastructure/DockerService";
import { InstanceService } from "~/services/infrastructure/InstanceService";

import { VaultRepository } from "~/repository/infrastructure/VaultRepository";
import { InstanceManager } from "./lib/instance-manager/InstanceManager";
import { DockviewInstance } from "./models/Instance";
import { VaultController } from "./controllers/vault.controller";
import { TOKENS } from "./tokens";

const instancesStorage = new Map<string, DockviewInstance>();
const projectsStorage = new Map<string, Set<string>>();

/**
 * Register services here
 */
export function registerServices() {
    // Register with tokens for interfaces
    container.register(TOKENS.VaultReader, {
        useValue: new VaultReader("./harborvault")
    });

    container.register(TOKENS.InstanceManager, 
         InstanceManager.bind(null,instancesStorage, projectsStorage),
         {
            lifecycle: Lifecycle.Singleton,
            
         }
    );

    container.register(TOKENS.ProjectAnalyzer, ProjectAnalyzer);

    container.register(TOKENS.VaultRepository, VaultRepository);

    /**
     * Services
     */
    container.register(TOKENS.VaultService, VaultService);

    container.register(TOKENS.DockerService, DockerService);

    container.registerSingleton(TOKENS.InstanceService, InstanceService);

    /**
     * Controllers
     */
    container.registerSingleton(TOKENS.VaultController, VaultController);
}


