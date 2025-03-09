import { defineConfig } from 'tsup';

export default defineConfig({
    entry: [
        'src/**/*.ts',
        'src/**/*.tsx',
    ],
    format: ['esm'],
    dts: true,
    sourcemap: true,
    clean: true,
    outDir: 'dist',
    splitting: false,
    outExtension: () => ({ js: '.js' }),
    tsconfig: 'tsconfig.build.json',
    external: [
        'react',
        'react-dom',
        '@radix-ui/*',
        'lucide-react',
        'tailwind-merge',
        'class-variance-authority',
        'clsx',
    ],
    esbuildOptions(options) {
        options.jsx = 'automatic';
    },
});