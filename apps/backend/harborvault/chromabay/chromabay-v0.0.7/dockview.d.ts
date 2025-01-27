// Define the module that people can import in their dockview.config.js
declare module "dockview" {
  // Configuration for Docker container
  type DKContainerConfig = {
    dockerfile?: string; // Path to the Dockerfile
    image?: string; // Docker image to use
  };

  // Command configuration for environments that require it (like Node)
  interface DKNodeEnvConfig {
    command: string; // The command to run (e.g., 'npm start')
  }

  // Directory configuration for static environments
  interface DKStaticEnvConfig {
    ports?: number[];
    directory: string; // The directory to serve (e.g., './dist')
  }

  // Dev, build, and serve configurations extend DKNodeEnvConfig
  interface DKDevConfig extends DKNodeEnvConfig {
    ports: number[];
    wsPorts?: number[];
  }

  interface DKServeConfig extends DKNodeEnvConfig {
    ports: number[];
    wsPorts?: number[];
  }

  interface DKBuildConfig extends DKNodeEnvConfig {}

  // Supported environments: Node or Static
  type DKEnvironment = "node" | "static" | "custom";

  // Common configuration shared between environments
  type DKBaseConfig = {
    environment: DKEnvironment;
    container?: DKContainerConfig;
  };

  // Static configuration for static environments
  export type DKStaticConfig = {
    environment: "static";
    staticEnv: DKStaticEnvConfig; // Static environment config (directory)
  } & DKBaseConfig;

  type DKCustomEnvConfig = {
    environment: "custom";
    container: {
      dockerfile: string;
    };
  };

  // Node configuration for node environments
  export type DKNodeConfig = {
    environment: "node";
    dev?: DKDevConfig; // Optional dev command (e.g., 'npm run dev')
    build?: DKBuildConfig; // Optional build command (e.g., 'npm run build')
    serve: DKServeConfig; // Serve command (e.g., 'npm start')
  } & DKBaseConfig;

  // Union type for both node and static environments
  export type DockviewConfig =
    | DKNodeConfig
    | DKStaticConfig
    | DKCustomEnvConfig;
}
