import { RequestHandler } from "express";
import express from "express";
import semver from "semver";
import { vaultReader } from "~/server";
import {
	TypedRequestHandler,
	V1ContentRequestResponse,
	V1Response,
} from "~/types/response";
import {
	ExtractVaultReaderResult,
	ReadProjectVersionsOptions,
} from "~/utils/local-vault";

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

// Public API Export
export type ServeStaticAssetsResponse = V1ContentRequestResponse;

export const serveStaticAssets: RequestHandler = (req, res, next) => {
	const { projectName, version } = req.params;

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

	express.static(data.result)(req, res, next);
};
