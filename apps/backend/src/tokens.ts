
export const TOKENS = {

    /**
     * Services
     */
    InstanceService: Symbol("InstanceService"),
    VaultService: Symbol("VaultService"),
    DockerService: Symbol("DockerService"),
    SetupService: Symbol("SetupService"),

    /**
     * Utilities
     */
    InstanceManager: Symbol("InstanceManager"),
    VaultReader: Symbol("VaultReader"),
    VaultWriter: Symbol("VaultWriter"),
    ProjectAnalyzer: Symbol("ProjectAnalyzer"),
    VaultRepository: Symbol("VaultRepository"),

    /**
     * Controllers
     */
    VaultController: Symbol("VaultController"),
    InstanceController: Symbol("InstanceController"),
};
