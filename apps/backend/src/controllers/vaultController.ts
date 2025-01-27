import { NextFunction,Request, Response, RequestHandler } from "express";
import semver from "semver";
import { containerManager, vaultReader } from "~/server";
import {
	TypedRequestHandler,
} from "~/types/response";

import { V1Response } from "@dockview/core/api/types/responses";

import {
	ExtractVaultReaderResult,
	ReadProjectVersionsOptions,
} from "~/utils/local-vault";

import { customAlphabet } from "nanoid";
import { DockviewServerContainer, DockviewStaticContainer } from "~/models/Container";
import { setupNginxEnvironment } from "~/pipelines/nginx.pipeline";
import { fakeContainerStart } from "~/utils/fakeDelay";
import { ContainerStatus } from "~/types/containerStatus.enum";
import { analyzeConfiguration, analyzeProjectType, selectPipeline, selectProjectMode } from "~/middlewares/analyzer";
const nanoid = customAlphabet("1234567890abcdefghijklmnopqrstuvxyz", 10);

// Handler & Public API Response
type AllProjects = ExtractVaultReaderResult<typeof vaultReader.readAllProjects>;
type GetAllProjectsHandler = TypedRequestHandler<AllProjects>;

// Public API Export
export type GetAllProjectsResponse = V1Response<AllProjects>;

export const getAllProjects: GetAllProjectsHandler = async (_req, res) => {
	const [data, err] = vaultReader.readAllProjects();

	if (err) {
		res.status(500).json({
			success: false,
			message: err.message,
			type: err.name,
			code: err.code,
			resource: null,
		});

		return;
	}

	res.status(200).json({
		success: true,
		resource: data,
	});
};

// Handler
type ProjectVersions = ExtractVaultReaderResult<
	typeof vaultReader.readProjectVersions
>;
type GetProjectVersionsHandler = TypedRequestHandler<ProjectVersions>;

// Public API Export
export type GetProjectVersionsResponse = V1Response<ProjectVersions>;

/**
 * Retrieves available versions of a project.
 */
export const getProjectVersions: GetProjectVersionsHandler = async (
	req,
	res
) => {
	const projectName = req.params.projectName;
	const { min, max } = req.query;

	let options = { minimum: min, maximum: max } as ReadProjectVersionsOptions;

	if ((min && !semver.valid(min)) || (max && !semver.valid(max))) {
		res.status(400).json({
			success: false,
			code: 404,
			message: "Invalid version provided (must be semver).",
			type: "BadRequest",
			resource: null,
		});
		return;
	}

	// Shouldn't happen, should be infront of a parent route.
	if (!projectName) {
		res.status(400).json({
			success: false,
			code: 404,
			message: "Project version not provided",
			type: "BadRequest",
			resource: null,
		});

		return;
	}

	const [data, err] = vaultReader.readProjectVersions(projectName, options);

	if (err) {
		res.status(err.code);

		res.json({
			success: false,
			message: err.message,
			type: err.name,
			code: err.code,
			resource: null,
		});

		return;
	}

	res.status(200).json({
		success: true,
		resource: data,
	});
};

type ContainerRequestResult = {
	containerURL: string;
	cold: boolean;
};
type RequestContainerHandler = TypedRequestHandler<ContainerRequestResult>;

// Public API Export
export type RequestContainerResponse = V1Response<ContainerRequestResult>;

export const requestContainer: RequestContainerHandler = async (req: Request, res: Response, next: NextFunction) => {
	const { projectName, version } = req.params;
	console.log("requestContainer", {projectName, version});

	if (!projectName || !version) {
		res.status(400).json({
			success: false,
			code: 400,
			message: "Project or version not provided",
			type: "BadRequest",
			resource: null,
		});

		return;
	}

	const [data, err] = vaultReader.getProjectAssetPath(projectName, version);

	if (err) {
		res.status(err.code).json({
			success: false,
			message: err.message,
			type: err.name,
			code: err.code,
			resource: null,
		});
		return;
	}

	// TODO: This temporary, need to handle server containers

	const availableInstance = containerManager.getExistingInstance(
		projectName,
		version
	);

	const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
	const prefix = "dv--";
	const baseDomain = `${process.env.DOMAIN || "localhost"}${
		process.env.NODE_ENV === "production" ? "" : `:${process.env.PORT}`
	}`;

	// If an instance is available, escape and return the URL
	if (availableInstance) {
		res.json({
			success: true,
			resource: {
				cold: !availableInstance.isReady,
				containerURL: `${protocol}://${prefix}${availableInstance.id}.${baseDomain}`,
			},
		});
		return;
	}


	// Handle static-server environment
	if(req.containerRequest.settings.provided.environment === "static-server") {

		const serverContainer = new DockviewServerContainer(
			projectName,
			version
		);


		const container = await setupNginxEnvironment(
			serverContainer.id,
			req.containerRequest.project + "-" + req.containerRequest.version,
			{
				sourceDir: req.containerRequest.sourcePath,
				buildDir:req.containerRequest.buildPath
			},
			req.selectedMode,
		);

		serverContainer.attach(container.ip, container.port);

		containerManager.registerContainer(serverContainer);

		const containerID = serverContainer.id;
		const target = `${protocol}://${prefix}${containerID}.${baseDomain}`;

		const instance = containerManager.getContainer(containerID);
		if (instance) {
			instance.status = ContainerStatus.TRANSITION;
		}

		return res.json({
			success: true,
			resource: {
				cold: true,
				containerURL: target,
			},
		});

	}

	const containerInstance = new DockviewStaticContainer(
		data.result,
		projectName,
		version
	);

	containerManager.registerContainer(containerInstance);

	const containerID = containerInstance.id;
	const target = `${protocol}://${prefix}${containerID}.${baseDomain}`;

	fakeContainerStart(1000).then(() => {
		const container = containerManager.getContainer(containerID);
		if (container) {
			container.status = ContainerStatus.LAUNCHING;
		}
	});
	fakeContainerStart(2000).then(() => {
		const container = containerManager.getContainer(containerID);
		if (container) {
			container.status = ContainerStatus.BUILD_IMAGE;
		}
	});
	fakeContainerStart(3000).then(() => {
		const container = containerManager.getContainer(containerID);
		if (container) {
			container.status = ContainerStatus.SPIN_UP;
		}
	});
	fakeContainerStart(4000).then(() => {
		const container = containerManager.getContainer(containerID);
		if (container) {
			container.status = ContainerStatus.READY;
		}
	});

	fakeContainerStart(4700).then(() => {
		const container = containerManager.getContainer(containerID);
		if (container) {
			container.status = ContainerStatus.TRANSITION;
		}
	});

	res.json({
		success: true,
		resource: {
			cold: true,
			containerURL: target,
		},
	});
	// res.redirect(target);
};
