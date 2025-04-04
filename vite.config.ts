import { resolve } from 'path';
import { defineConfig, type LibraryFormats } from 'vite';
import vue from '@vitejs/plugin-vue';
import react from '@vitejs/plugin-react';

type BuildTargets = NodeJS.ProcessEnv['BUILD_TARGET'];

const formats: { [K in BuildTargets]: LibraryFormats[] } = {
  browser: ['iife'],
  vue: ['es', 'cjs'],
  react: ['es', 'cjs'],
  module: ['es', 'cjs'],
};

const entries = {
  browser: 'src/browser/responsive-vid.ts',
  vue: 'src/vue/responsive-vid.vue',
  react: 'src/react/responsive-vid.tsx',
  module: 'src/module/responsive-vid.ts',
};

// Helper to create build configuration based on target
function createBuildConfig(target: BuildTargets) {
  const isVue = target === 'vue';
  const isReact = target === 'react';

  return defineConfig({
    resolve: {
      alias: {
        '@': resolve(__dirname, './src/'),
      },
    },
    build: {
      emptyOutDir: false,
      outDir: `./dist/${target}`,
      target: 'es6',
      minify: true,
      lib: {
        entry: resolve(__dirname, entries[target]),
        name: 'ResponsiveVideo',
        formats: formats[target],
        fileName: target === 'browser' ? () => 'responsive-vid.js' : undefined,
      },
      rollupOptions: {
        external: isVue ? ['vue'] : isReact ? ['react', 'react-dom', 'react-dom', 'react/jsx-runtime'] : [],
        output: {
          globals: isVue
            ? { vue: 'Vue' }
            : isReact
              ? { react: 'React', 'react-dom': 'ReactDOM', 'react/jsx-runtime': 'ReactJSXRuntime' }
              : {},
        },
      },
    },
    plugins: [isVue ? vue() : null, isReact ? react() : null].filter(Boolean),
  });
}

// Export configuration based on environment variable
export default createBuildConfig(process.env.BUILD_TARGET as BuildTargets);
