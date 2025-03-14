import * as esbuild from "esbuild";

const entryPoints = {
  "dockview-ws": "src/client/scripts/ws.ts",
  "dockview-status": "src/client/status-entry.ts",
  "dockview-instance": "src/client/instance-entry.ts",
};

const baseConfig = {
  entryPoints,
  bundle: true,
  sourcemap: true,
  outdir: "public",
  platform: "browser",
  format: "esm",
  treeShaking: true,
  define: {
    'process.env.NODE_ENV': process.argv.includes("--dev") 
      ? '"development"' 
      : '"production"'
  },
  external: [],
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
