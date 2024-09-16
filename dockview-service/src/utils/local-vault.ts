import fs from "fs";
import chalk from "chalk";
import path from "path";

export class VaultReaderError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "VaultReaderError";
    this.message = `VaultReaderError: ${message}`;
  }
}

type ReadAllProjectsResult =
  | [{ message: string; result: string[] }, null]
  | [null, VaultReaderError];

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
}
