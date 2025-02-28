declare global {
  namespace NodeJS {
    interface ProcessEnv {
      BUILD_TARGET: 'vue' | 'module' | 'browser';
      NODE_ENV: 'development' | 'production';
    }
  }
}
export {};