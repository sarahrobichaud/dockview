import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';
import replace from '@rollup/plugin-replace';
import json from '@rollup/plugin-json';
import gzip from 'rollup-plugin-gzip';

const isDev = process.argv.includes("--dev");

const createConfig = (entryPoint) => ({
  input: `src/client/${entryPoint}`,
  output: {
    dir: `public`,
    format: 'esm',
    manualChunks: (id) => {
      if (id.includes('node_modules')) {
        return 'vendor';
      }
    }
  },
  plugins: [
    resolve({
      browser: true,
    }),
    commonjs(),
    json(),
    typescript({
      tsconfig: 'tsconfig.client.json',
    }),
    replace({
      preventAssignment: true,
      'process.env.NODE_ENV': JSON.stringify(isDev ? 'development' : 'production'),
    }),
    terser(),
    gzip(),
  ].filter(Boolean),
});

export default [
  createConfig('status-entry.ts'),
  createConfig('instance-entry.ts'),
  createConfig('scripts/ws.ts'),
];