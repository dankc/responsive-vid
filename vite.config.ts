import { resolve } from 'path'
import { defineConfig, type LibraryFormats } from 'vite'
import vue from '@vitejs/plugin-vue'

type BuildTypes = 'vue' | 'vanilla' | 'iife'

const formats: {[K in BuildTypes]: LibraryFormats[]} = {
  iife: ['iife'],
  vue: ['es', 'cjs'],
  vanilla: ['es', 'cjs'],
}

const entries = {
  iife: 'src/iife/responsive-video.ts',
  vue: 'src/vue/ResponsiveVideo.vue',
  vanilla: 'src/vanilla/responsive-video.ts',
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
      target: 'esnext',
      lib: {
        entry: resolve(__dirname, entries[target]),
        name: 'ResponsiveVideo',
        formats: formats[target],
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