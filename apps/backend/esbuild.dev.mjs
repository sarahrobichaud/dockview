import * as esbuild from "esbuild";

const entryPoints = {
  "ws": "src/client/scripts/ws.ts",
  "status-entry": "src/client/status-entry.ts",
  "instance-entry": "src/client/instance-entry.ts",
};

const baseConfig = {
  entryPoints,
  bundle: true,
  sourcemap: true,
  outdir: "public",
  platform: "browser",
  format: "esm",
  define: {
    'process.env.NODE_ENV': '"development"'
  },
};


const ctx = await esbuild.context({
  ...baseConfig,
});

await ctx.watch();

console.log("Watching...");
