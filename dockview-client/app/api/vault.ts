import type { AppLoadContext } from "@remix-run/node";
import {
	GetAllProjectsResponse,
	GetProjectVersionsResponse,
	RequestContainerResponse,
} from "~/lib/dockview-api";

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

	static async fetchAvailableProjectsNames(ctx: AppLoadContext) {
		try {
			const resource = VaultAPI.getResourcePath(ctx);

			const res = await fetch(resource);
			const json = (await res.json()) as GetAllProjectsResponse;

			if (!json.success) {
				throw new VaultAPIError(json.message);
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
			const json = (await res.json()) as GetProjectVersionsResponse;

			if (!json.success) {
				throw new VaultAPIError(json.message);
			}

			return json;
		} catch (err) {
			throw err;
		}
	}

	static async requestContainer(
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

			const json = (await res.json()) as RequestContainerResponse;

			console.log({ json });

			if (!json.success) {
				throw new VaultAPIError(json.message);
			}

			return json;
		} catch (err) {
			throw err;
		}
	}
}
