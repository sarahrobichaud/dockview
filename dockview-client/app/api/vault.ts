export default class VaultAPI {
  static async fetchAvailableVersions(
    projectName: string,
    min: string | null = null,
    max: string | null = null
  ) {
    try {
      const url = "/vault/" + projectName;
      const searchParams = new URLSearchParams();

      if (min) {
        searchParams.set("min", min);
      }
      if (max) {
        searchParams.set("max", max);
      }

      const res = await fetch(url + "?" + searchParams);
      const json = await res.json();

      if (!json.success) {
        throw new Error(json.message);
      }

      return json.data.map((v) =>
        v.replace(`${projectName}-v`, "")
      ) as string[];
    } catch (err) {
      throw err;
    }
  }
}
