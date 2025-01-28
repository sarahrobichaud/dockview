import fs from "fs";
import chalk from "chalk";
import path from "path";
import semver from "semver";
import { off } from "process";
import { Container } from "dockerode";
import { ContainerRequest } from "~/models/ContainerRequest";
import { DockviewConfig } from "dockview";

export class VaultReaderError extends Error {
  public readonly code: number;
  constructor(message: string, code: number = 500) {
    super(message);
    this.name = "VaultReaderError";
    this.code = code;
  }
}

export type ExtractVaultReaderResult<T extends (...args: any) => any> =
  NonNullable<ReturnType<T>[0]>;

type VaultReaderErrorResult = [null, VaultReaderError];

type VaultReaderSuccessResult<T> = [{ message: string; result: T }, null];

type VaultReaderResult<T> =
  | VaultReaderSuccessResult<T>
  | VaultReaderErrorResult;

type ReadAllProjectsResult = VaultReaderResult<string[]>;

type ReadProjectVersions = VaultReaderResult<string[]>;

type ProjectAssetPathResult = VaultReaderResult<string>;

export type ReadProjectVersionsOptions = {
  minimum: string;
  maximum: string;
};

export class VaultReader {
  private vaultPath: string;

  constructor(absoluteVaultPath: string) {
    this.vaultPath = absoluteVaultPath;
  }

  public readAllProjects(): ReadAllProjectsResult {
    const ignoreFiles = ["node_modules", ".git", "README.md"];

    try {
      const projects = fs.readdirSync(this.vaultPath);
      const filteredProjects = projects.filter((project) => {
        try {
          if (ignoreFiles.includes(project)) {
            return false;
          }

          const [availableVersions, err] = this.readProjectVersions(project);

          if (err) {
            return false;
          }

          return (
            !ignoreFiles.includes(project) &&
            availableVersions?.result.length > 0
          );
        } catch (err) {
          return false;
        }
      });
      return [
        {
          result: filteredProjects,
          message: "Projects read successfully",
        },
        null,
      ];
    } catch (err) {
      if (!(err instanceof Error)) {
        return [null, new VaultReaderError("Unknown error")];
      }

      const fsError = err as NodeJS.ErrnoException;

      if (fsError.code === "ENOENT") {
        console.log(chalk.blue(`Directory not found: ${fsError.message}`));
      } else if (fsError.code === "ENOTDIR") {
        console.log(chalk.blue(`Not a directory: ${fsError.message}`));
      } else if (fsError.code === "EACCES") {
        console.log(chalk.blue(`Missing permissions: ${fsError.message}`));
      } else {
        console.log(chalk.blue(`Unknown error: ${fsError.message}`));
      }
      return [
        null,
        new VaultReaderError("An error occured while reading projects", 500),
      ];
    }
  }

  public readProjectVersions(
    projectName: string,
    options?: ReadProjectVersionsOptions
  ): ReadProjectVersions {
    const projectPath = path.join(this.vaultPath, projectName);

    try {
      const versions = fs.readdirSync(projectPath);

      const cleaned = versions.map((version) =>
        version.replace(`${projectName}-v`, "")
      );

      const result = cleaned.filter((version) => {
        if (options?.minimum && semver.lt(version, options.minimum)) {
          return false;
        }

        if (options?.maximum && semver.gt(version, options.maximum)) {
          return false;
        }

        return true;
      });

      if (result.length === 0) {
        return [
          null,
          new VaultReaderError(
            `No versions found for the requested range.`,
            404
          ),
        ];
      }

      const validVersions = result.filter((v) => {
        try {
          this.validateProject(this.getProjectPath(projectName, v));

          return true;
        } catch (err) {
          return false;
        }
      });

      return [
        {
          message: `Available versions for ${projectName}`,
          result: validVersions,
        },
        null,
      ];
    } catch (err) {
      if (!(err instanceof Error)) {
        return [null, new VaultReaderError("Unknown error")];
      }

      const fsError = err as NodeJS.ErrnoException;

      let code = 500;
      let publicMessage = `An error occured while reading ${projectName}`;

      switch (fsError.code) {
        case "ENOENT":
          console.log(chalk.blue(`Directory not found: ${fsError.message}`));
          code = 404;
          publicMessage = `Project '${projectName}' not found`;
          break;

        case "ENOTDIR":
          console.log(chalk.blue(`Not a directory: ${fsError.message}`));
          code = 404;
          publicMessage = `Project '${projectName}' not found`;
          break;

        case "EACCES":
          console.log(chalk.blue(`Missing permissions: ${fsError.message}`));
          publicMessage = `Configuration issue with ${projectName}`;
          break;

        default:
          console.log(chalk.blue(`Unknown error: ${fsError.message}`));
          break;
      }

      return [null, new VaultReaderError(publicMessage, code)];
    }
  }

  private async getConfig(projectPath: string): Promise<DockviewConfig> {
    const configPath = path.join(projectPath, "source", "dockview.config.js");
    const configContent = fs.readFileSync(configPath, "utf8");

    // get default export

    const module = await import(configPath);
    const config = (module.default || module) as DockviewConfig;

    return config;
  }

  public async getProjectAssetPath(
    projectName: string,
    version: string
  ): Promise<ProjectAssetPathResult> {
    const projectPath = this.getProjectPath(projectName, version);

    try {
      this.validateProject(projectPath);
      const config = await this.getConfig(projectPath);

      let buildPath: string;
      switch (config.environment) {
        case "static":
        case "static-server":
          buildPath = path.join(
            projectPath,
            "source",
            config.staticEnv.directory
          );
          break;
        default:
          // Default for now
          buildPath = path.join(projectPath, "source", "dist");
          break;
      }

      return [{ message: "Project assets found", result: buildPath }, null];
    } catch (err) {
      if (err instanceof VaultReaderError) {
        return [null, err];
      }
      console.log(err);
      throw new VaultReaderError("Unexpected Server error", 500);
    }
  }

  private getProjectDirectories(basePath: string): [string, string, string] {
    const buildPath = path.join(basePath, "build");
    const sourcePath = path.join(basePath, "source");
    const configPath = path.join(sourcePath, "dockview.config.js");

    return [sourcePath, buildPath, configPath];
  }

  private validateProject(projectPath: string) {
    const [sourcePath, buildPath, configPath] =
      this.getProjectDirectories(projectPath);

    try {
      console.log({ sourcePath, buildPath, configPath });

      const configExists = fs.existsSync(configPath);

      if (!configExists) {
        throw new VaultReaderError("Project configuration is missing", 503);
      }
    } catch (err) {
      throw err;
    }
  }

  public analyzeProjectRequest(
    projectName: string,
    version: string
  ): ContainerRequest {
    const request = {} as ContainerRequest;

    const projectPath = this.getProjectPath(projectName, version);

    request.project = projectName;
    request.version = version;

    const [sourcePath, buildPath, configPath] =
      this.getProjectDirectories(projectPath);

    request.buildPath = buildPath;
    request.sourcePath = sourcePath;

    request.projectType = this.getProjectType(sourcePath);

    return request;
  }

  private getProjectPath(projectName: string, version: string): string {
    return path.join(this.vaultPath, projectName, `${projectName}-v${version}`);
  }

  public getProjectType(sourceDir: string) {
    if (fs.existsSync(path.join(sourceDir, "package.json"))) {
      const packageJson = JSON.parse(
        fs.readFileSync(path.join(sourceDir, "package.json"), "utf8")
      );
      if (packageJson.dependencies["react"]) {
        return "react";
      } else if (packageJson.dependencies["vue"]) {
        return "vue";
      } else if (packageJson.dependencies["express"]) {
        return "node";
      }
    } else if (fs.existsSync(path.join(sourceDir, "requirements.txt"))) {
      return "python";
    } else if (fs.existsSync(path.join(sourceDir, "index.html"))) {
      return "static";
    }
    throw new Error("Unsupported project type");
  }
}
