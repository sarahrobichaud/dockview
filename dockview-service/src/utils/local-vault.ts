import fs from "fs";
import chalk from "chalk";
import path from "path";

export class VaultReaderError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "VaultReaderError";
  }
}

type VaultReaderErrorResult = [null, VaultReaderError];
type VaultReaderSuccessResult<T> = [{ message: string; result: T }, null];

type VaultReaderResult<T> =
  | VaultReaderSuccessResult<T>
  | VaultReaderErrorResult;

type ReadAllProjectsResult = VaultReaderResult<string[]>;
type ReadProjectVersions = VaultReaderResult<string[]>;

export class VaultReader {
  private vaultPath: string;

  constructor(absoluteVaultPath: string) {
    this.vaultPath = absoluteVaultPath;
  }

  public readAllProjects(): ReadAllProjectsResult {
    const ignoreFiles = ["node_modules", ".git", "README.md"];

    try {
      const projects = fs.readdirSync(this.vaultPath);
      const filteredProjects = projects.filter(
        (project) => !ignoreFiles.includes(project)
      );
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
      return [null, new VaultReaderError(`${err.message}`)];
    }
  }

  public readProjectVersions(projectName: string): ReadProjectVersions {
    const projectPath = path.join(this.vaultPath, projectName);

    try {
      const versions = fs.readdirSync(projectPath);

      console.log(chalk.green(`Versions read successfully for ${projectName}`));

      return [
        { message: `Available versions for ${projectName}`, result: versions },
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
      return [null, new VaultReaderError(`${err.message}`)];
    }
  }
}
