// docker-templates.ts

import { DKNodeConfig, DKStaticConfig, DockviewConfig } from "dockview";
import { ContainerRequest } from "~/models/ContainerRequest";

// Function to generate a Node Dockerfile
function generateNodeDockerfile(config: DKNodeConfig, activeMode: string, requireBuild = false) {
  let dockerfileContent = "";

  // Use the provided Docker image if specified, otherwise default to node:14-alpine
  const image = config.container?.image || "node:20-alpine";

  dockerfileContent += `FROM ${image}\n`;

  dockerfileContent += `RUN apk update && apk add vim\n`;

  dockerfileContent += `WORKDIR /app\n`;

  dockerfileContent += `COPY package*.json ./\n`;

  // Install dependencies
  dockerfileContent += `RUN npm install\n`;

  dockerfileContent += `COPY . .\n`;

  dockerfileContent += `ENV NODE_ENV=${activeMode}\n`;

  if (activeMode === "production" && requireBuild) {
    if (!config.build?.command) {
      throw new Error("Build neccessary but no command was provided!");
    }

    dockerfileContent += `RUN ${config.build.command}\n`;
  }

  switch (activeMode) {
    case "development":
    //   config.dev.ports.forEach((p) => {
    //     dockerfileContent += `EXPOSE ${p}\n`;
    //   });
    //   if (config.dev.wsPorts) {
    //     config.dev.wsPorts.forEach((p) => {
    //       dockerfileContent += `EXPOSE ${p}\n`;
    //     });
    //   }

    //   dockerfileContent += `CMD ${config.dev.command}\n`;
      break;
    case "production":
      config.serve.ports.forEach((p) => {
        dockerfileContent += `EXPOSE ${p}\n`;
      });
      if (config.serve.wsPorts) {
        config.serve.wsPorts.forEach((p) => {
          dockerfileContent += `EXPOSE ${p}\n`;
        });
      }

      dockerfileContent += `CMD ${config.serve.command}\n`;
      break;
    default:
      throw new Error("Unsupported mode");
  }

  return dockerfileContent;
}

// Function to generate a Static Dockerfile
function generateStaticDockerfile(config: DKStaticConfig, activeMode: string, requireBuild = false) {
  let dockerfileContent;

  dockerfileContent = `FROM nginx:alpine\n`;

  // if (activeMode === "production" && requireBuild) {
  //   if (!config.build?.command) {
  //     throw new Error("Build neccessary but no command was provided!");
  //   }
  //   dockerfileContent += `RUN ${config.build.command}\n`;
  // }

  dockerfileContent += `WORKDIR /usr/share/nginx/html\n`;
  dockerfileContent += `COPY ${config.staticEnv.directory} .\n`;

  // Expose static environment ports
  // TODO: SSL issues?
  dockerfileContent += `EXPOSE 80\n`;

  // Start nginx
  dockerfileContent += `CMD ["nginx", "-g", "daemon off;"]\n`;

  return dockerfileContent;
}

// Main function to generate Dockerfile based on environment
export function generateDockerfile(config: ContainerRequest['settings'], mode: string) {
  let dockerfileContent = "";
  const { provided,  buildRequired } = config;

  switch (provided.environment) {
    case "node":
      dockerfileContent = generateNodeDockerfile(provided, mode, buildRequired);
      break;
    case "static":
      dockerfileContent = generateStaticDockerfile(
        provided,
        mode,
        buildRequired
      );
      break;
    default:
      throw new Error("Unsupported environment type");
  }

  return dockerfileContent;
}