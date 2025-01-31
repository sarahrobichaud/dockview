import type { AppLoadContext } from "react-router";

import {LimitedProjectVersion, Project} from "@dockview/core/shared"

import { DockviewAPIResponse, InstanceRequestResponse } from "@dockview/core/api"

import {
	GetAllProjectsResponse,
	GetProjectVersionsResponse,
	RequestContainerResponse,
} from "@dockview/core/api/responses/vault";


export class VaultAPIError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "VaultAPIError";
	}
}

export default class VaultAPI {
	static vaultVersion = 1;
	static vaultParamName = "vault";

	private static getResourcePath(ctx: AppLoadContext, path: string = "") {
		const url = ctx.dockview.INTERNAL_ADDRESS;

		return `${url}/v${VaultAPI.vaultVersion}/${VaultAPI.vaultParamName}` + path;
	}

	static async fetchAvailableProjects(ctx: AppLoadContext) {
		try {
			const resource = VaultAPI.getResourcePath(ctx);

			const res = await fetch(resource);

			const json = (await res.json()) as DockviewAPIResponse<Project[]>;

			if (!json.success) {
				throw new VaultAPIError(json.error.message);
			}

			return json;
		} catch (err) {
			throw err;
		}
	}
	static async fetchAvailableProjectVersions(
		ctx: AppLoadContext,
		projectName: string
	) {
		try {
			const resource = VaultAPI.getResourcePath(ctx, `/${projectName}`);

			const res = await fetch(resource);
			const json = (await res.json()) as DockviewAPIResponse<LimitedProjectVersion[]>;

			if (!json.success) {
				throw new VaultAPIError(json.error.message);
			}

			return json;
		} catch (err) {
			throw err;
		}
	}

	static async requestInstance(
		ctx: AppLoadContext,
		projectName: string,
		version: string
	) {
		try {
			const resource = VaultAPI.getResourcePath(
				ctx,
				`/${projectName}/${version}/live`
			);

			console.log({ resource });

			const res = await fetch(resource, {
				method: "GET",
			});

			const json = (await res.json()) as DockviewAPIResponse<InstanceRequestResponse>;

			console.log({ json });

			if (!json.success) {
				throw new VaultAPIError(json.error.message);
			}

			return json;
		} catch (err) {
			throw err;
		}
	}
}
