// Define the module that people can import in their dockview.config.js
declare module "dockview" {
  // Configuration for Docker container
  type DKContainerConfig = {
    dockerfile?: string; // Path to the Dockerfile
    image?: string; // Docker image to use
  };

  // Command configuration for environments that require it (like Node)
  interface DKNodeEnvConfig {
    command: string[]; // The command to run (e.g., 'npm start')
  }

  // Directory configuration for static environments
  interface DKStaticEnvConfig {
    directory: string; // The directory to serve (e.g., './dist')
    ports: number[];
  }


  interface DKServeConfig extends DKNodeEnvConfig {
    ports: number[];
    wsPorts?: number[];
  }

  interface DKBuildConfig extends DKNodeEnvConfig {}

  // Supported environments: Node or Static
  type DKEnvironment = "static" | "static-server" | "node-server"

  // Common configuration shared between environments
  type DKBaseConfig = {
    environment: DKEnvironment;
    container?: DKContainerConfig;
  };

  // Static configuration for static environments
  export type DKStaticConfig = {
    environment: "static" | "static-server";
    staticEnv: DKStaticEnvConfig; // Static environment config (directory)
    build: {
      command: string[];
    }
  } & DKBaseConfig;


  // Node configuration for node environments
  export type DKNodeConfig = {
    environment: "node-server";
    buildDirectory: string;
    build: {
      command: string[];
    }
    serve: {
      command: string[];
      ports: number[];
      wsPorts?: number[];
    }
  } & DKBaseConfig;

  // Union type for both node and static environments
  export type DockviewConfig =
    | DKNodeConfig
    | DKStaticConfig
}
