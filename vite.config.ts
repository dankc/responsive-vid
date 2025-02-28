import { resolve } from 'path'
import { defineConfig, type LibraryFormats } from 'vite'
import vue from '@vitejs/plugin-vue'

type BuildTypes = 'vue' | 'module' | 'browser'

const formats: {[K in BuildTypes]: LibraryFormats[]} = {
  browser: ['iife'],
  vue: ['es', 'cjs'],
  module: ['es', 'cjs'],
}

const entries = {
  browser: 'src/browser/responsive-vid.ts',
  vue: 'src/vue/ResponsiveVid.vue',
  module: 'src/module/responsive-vid.ts',
}

// Helper to create build configuration based on target
function createBuildConfig(target: BuildTypes) {
  const isVue = target === 'vue';

  return defineConfig({
    resolve: {
      alias: {
        '@': resolve(__dirname, "./src/")
      }
    },
    build: {
      emptyOutDir: false,
      outDir: `./dist/${target}`,
      target: 'es6',
      lib: {
        entry: resolve(__dirname, entries[target]),
        name: 'ResponsiveVideo',
        formats: formats[target],
        fileName: target === 'browser' ? () => 'responsive-vid.js' : undefined
      },
      rollupOptions: {
        external: isVue ? ['vue'] : [],
        output: {
          globals: isVue ? { vue: 'Vue' } : {},
          dir: `./dist/${target}`,
        }
      }
    },
    plugins: [
      isVue ? vue() : null,
    ].filter(Boolean),
  });
}

// Export configuration based on environment variable
export default createBuildConfig((process.env.BUILD_TARGET as BuildTypes));