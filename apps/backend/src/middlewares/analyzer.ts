
import { saveDockerfile } from "../containers/docker/docker-utils";
import fs from "fs";
import path from "path";

import { generateDockerfile } from "../containers/docker/docker-generate";


import { NextFunction , Request, Response} from "express";
import { vaultReader as vault} from "~/server";


export function analyzeProjectType(req: Request, res: Response, next: NextFunction) {
  const project = req.params.project;
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
  const config = module.default || module;

  const configProvidesServe = Object.keys(config).includes("serve");
  // Production is available if serving static build or node env has a serve command
  if (config.environment === "static" || configProvidesServe) {
    availableModes.push("production");
  }

  // Not supported in config anymore
  // if (Object.keys(config).includes("dev")) {
  //   availableModes.push("development");
  // }

  const directoryContent = fs.readdirSync(req.containerRequest.sourcePath);

  req.containerRequest.settings = {
    provided: config,
    buildRequired: !directoryContent.includes(config.buildDirectory),
  }

  req.availableModes = availableModes;

  next();
}

export async function selectPipeline(req: Request, res: Response, next: NextFunction) {
  const contents = fs.readdirSync(req.containerRequest.sourcePath);
  const containerRequest = req.containerRequest;

  const dockerfileExists = contents.includes(`Dockerfile.${req.selectedMode}`);

  if (!dockerfileExists) {
    const dockerfileContent = generateDockerfile(containerRequest.settings, req.selectedMode);
    const fileName = `Dockerfile.${req.selectedMode}`;
    saveDockerfile(containerRequest.sourcePath, fileName, dockerfileContent);
  }

  switch (containerRequest.settings.provided.environment) {
    case "node":
    //   return RequestNodeEnvironment(req, res, next);
    case "static":
    //   return RequestNginxEnvironment(req, res, next);
      break;
  }
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