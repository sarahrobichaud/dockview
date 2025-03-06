import * as esbuild from "esbuild";

const baseConfig = {
  entryPoints: ["src/scripts/client.ts"],
  bundle: true,
  sourcemap: true,
  outfile: "public/dockview-client.js",
  platform: "browser",
  define: {
    'process.env.NODE_ENV': process.argv.includes("--dev") 
      ? '"development"' 
      : '"production"'
  },
  // Make sure React is properly handled
  external: [],
  loader: {
    '.tsx': 'tsx',
    '.ts': 'ts',
    '.jsx': 'jsx',
    '.js': 'js',
  },
  // Ensure JSX is transformed
  jsx: 'automatic',
  jsxFactory: 'React.createElement',
  jsxFragment: 'React.Fragment',
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
