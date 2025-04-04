declare namespace NodeJS {
  interface ProcessEnv {
    BUILD_TARGET: 'vue' | 'react' | 'module' | 'browser';
    NODE_ENV: 'development' | 'production';
  }
}
