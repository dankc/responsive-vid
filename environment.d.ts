declare global {
  namespace NodeJS {
    interface ProcessEnv {
      BUILD_TARGET: 'vue' | 'vanilla' | 'iife';
      NODE_ENV: 'development' | 'production';
    }
  }
}
export {};