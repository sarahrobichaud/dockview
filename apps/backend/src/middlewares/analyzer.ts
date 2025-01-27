import { saveDockerfile } from "../containers/docker/docker-utils";
import fs from "fs";
import path from "path";

import { generateDockerfile } from "../containers/docker/docker-generate";

import { NextFunction , Request, Response} from "express";
import { vaultReader as vault} from "~/server";
import { DockviewConfig } from "dockview";
import { fileURLToPath } from "url";


const __dirname = path.dirname(fileURLToPath(import.meta.url));


export function analyzeProjectType(req: Request, res: Response, next: NextFunction) {
  const project = req.params.projectName;
  const version = req.params.version;


  try {
    req.containerRequest = vault.analyzeProjectRequest(project, version);
    } catch (error) {
    if(error instanceof Error) {
      return res.json({
        success: false,
        message: error.message,
      });
    } else {
      return res.json({
        success: false,
        message: "Unknown error",
      });
    }
  }
  // Build request
  next();
}

export async function analyzeConfiguration(req: Request, _res: Response, next: NextFunction) {
  const availableModes = [];

  const configPath = path.join(req.containerRequest.sourcePath, "dockview.config.js");

  const module = await import(configPath);
  const config = (module.default || module) as DockviewConfig;

  const configProvidesServe = Object.keys(config).includes("serve");
  // Production is available if serving static build or node env has a serve command
  if (config.environment === "static" || config.environment === 'static-server' || configProvidesServe) {
    availableModes.push("production");
  }

  // Not supported in config anymore
  // if (Object.keys(config).includes("dev")) {
  //   availableModes.push("development");
  // }

  const directoryContent = fs.readdirSync(req.containerRequest.sourcePath);




  if(config.environment === "static"){
    req.containerRequest.settings = {
      provided: config,
      buildRequired: !directoryContent.includes(config.staticEnv.directory),
    }
  }else {
    req.containerRequest.settings = {
      provided: config,
      buildRequired: true,
    }
  }


  req.availableModes = availableModes;

  next();
}

export async function selectPipeline(req: Request, res: Response, next: NextFunction) {
  const contents = fs.readdirSync(req.containerRequest.sourcePath);
  const containerRequest = req.containerRequest;

  const dockerfileExists = contents.includes(`Dockerfile.${req.selectedMode}`);


  if(containerRequest.settings.provided.environment === "static-server" || containerRequest.settings.provided.environment === "node"
  ){

  if (!dockerfileExists) {
    // Save nginx config for static environments
    if (containerRequest.settings.provided.environment === "static-server") {

        // Copy nginx config to source path
        const nginxConfigPath = path.join(__dirname, '..', 'containers', 'docker', 'config', 'default.nginx.conf');
        const nginxConfig = fs.readFileSync(nginxConfigPath, 'utf8');

        fs.writeFileSync(path.join(containerRequest.sourcePath, 'default.nginx.conf'), nginxConfig);
    }

    const dockerfileContent = generateDockerfile(containerRequest.settings, req.selectedMode);
    const fileName = `Dockerfile.${req.selectedMode}`;
    saveDockerfile(containerRequest.sourcePath, fileName, dockerfileContent);
  }

}
  next();
}

export function selectProjectMode(mode: string) {
  return function (req: Request, res: Response, next: NextFunction) {
    if (!req.availableModes.includes(mode)) {
      return res.json({
        success: false,
        message: "Invalid mode",
        availableModes: req.availableModes,
      });
    }
    req.selectedMode = mode;
    next();
  };
}