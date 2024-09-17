import type { AppLoadContext } from "@remix-run/node";
import { GetAllProjectsResponse } from "~/lib/dockview-api";

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
}
