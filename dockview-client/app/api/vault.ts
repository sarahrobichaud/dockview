import type { AppLoadContext } from "@remix-run/node";

export default class VaultAPI {
  static vaultVersion = 1;
  static vaultParamName = "vault";

  private static getResourcePath(ctx: AppLoadContext, path: string = "") {
    const url = ctx.dockview.INTERNAL_ADDRESS;
    return `${url}/v${VaultAPI.vaultVersion}/${VaultAPI.vaultParamName}` + path;
  }

  // static async fetchAvailableVersions(
  //   projectName: string,
  //   min: string | null = null,
  //   max: string | null = null
  // ) {
  //   try {
  //     const url = "/vault/" + projectName;
  //     const searchParams = new URLSearchParams();

  //     if (min) {
  //       searchParams.set("min", min);
  //     }
  //     if (max) {
  //       searchParams.set("max", max);
  //     }

  //     const res = await fetch(url + "?" + searchParams);
  //     const json = await res.json();

  //     if (!json.success) {
  //       throw new Error(json.message);
  //     }

  //     return json.data.map((v) =>
  //       v.replace(`${projectName}-v`, "")
  //     ) as string[];
  //   } catch (err) {
  //     throw err;
  //   }
  // }

  static async fetchAvailableProjectsNames(ctx: AppLoadContext) {
    try {
      const resource = VaultAPI.getResourcePath(ctx);
      console.log({ resource });

      const res = await fetch(resource);
      const json = await res.json();

      if (!json.success) {
        throw new Error(json.message);
      }

      console.log({ json });
    } catch (err) {
      throw err;
    }
  }
}
