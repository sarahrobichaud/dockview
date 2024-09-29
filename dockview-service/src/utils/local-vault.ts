import fs from "fs";
import chalk from "chalk";
import path from "path";
import semver from "semver";
import { off } from "process";

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

			return [
				{ message: `Available versions for ${projectName}`, result },
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

	public getProjectAssetPath(
		projectName: string,
		version: string
	): ProjectAssetPathResult {
		const projectPath = this.getProjectPath(projectName, version);

		try {
			this.validateProject(projectPath);

			const buildPath = path.join(projectPath, "build", "dist");

			return [{ message: "Project assets found", result: buildPath }, null];
		} catch (err) {
			if (err instanceof VaultReaderError) {
				return [null, err];
			}
			throw new VaultReaderError("Unexpected Server error", 500);
		}
	}

	private validateProject(projectPath: string) {
		const buildPath = path.join(projectPath, "build");
		const sourcePath = path.join(projectPath, "source");

		try {
			const buildExists = fs.existsSync(buildPath);

			if (!buildExists) {
				throw new VaultReaderError("Project has no builds", 503);
			}

			const configPath = path.join(sourcePath, "dockview.config.js");
			const configExists = fs.existsSync(configPath);

			if (!configExists) {
				throw new VaultReaderError("Project configuration is missing", 503);
			}

			const indexHtmlPath = path.join(buildPath, "dist", "index.html");
			const indexHtmlExists = fs.existsSync(indexHtmlPath);

			if (!indexHtmlExists) {
				throw new VaultReaderError("Nothing to serve", 503);
			}
		} catch (err) {
			throw err;
		}
	}

	private getProjectPath(projectName: string, version: string): string {
		return path.join(this.vaultPath, projectName, `${projectName}-v${version}`);
	}
}
