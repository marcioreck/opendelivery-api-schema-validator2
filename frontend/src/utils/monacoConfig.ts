import { loader } from '@monaco-editor/react';

// Configure Monaco Editor to use local files instead of CDN
loader.config({
  // Use local monaco-editor files
  paths: {
    vs: '/node_modules/monaco-editor/min/vs'
  }
});

export default loader;
