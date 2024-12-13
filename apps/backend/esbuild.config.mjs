import * as esbuild from "esbuild";

const baseConfig = {
  entryPoints: ["src/scripts/client.ts"],
  bundle: true,
  sourcemap: true,
  outfile: "public/dockview-client.js",
  platform: "browser",
};

const isDev = process.argv.includes("--dev");

if (isDev) {
  const ctx = await esbuild.context({
    ...baseConfig,
  });

  await ctx.watch();
  console.log("Watching...");
} else {
  await esbuild.build({
    ...baseConfig,
    minify: true,
  });
}
