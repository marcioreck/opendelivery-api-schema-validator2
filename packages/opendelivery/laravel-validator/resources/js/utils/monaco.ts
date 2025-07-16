// OpenDelivery Laravel Validator - Monaco Editor Configuration

// Monaco Editor default options
export const DEFAULT_EDITOR_OPTIONS = {
  fontSize: 14,
  lineHeight: 1.5,
  fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
  wordWrap: 'on' as const,
  minimap: {
    enabled: true,
    scale: 1,
    showSlider: 'mouseover' as const,
  },
  scrollBeyondLastLine: false,
  automaticLayout: true,
  tabSize: 2,
  insertSpaces: true,
  detectIndentation: true,
  renderLineHighlight: 'line' as const,
  renderIndentGuides: true,
  renderWhitespace: 'boundary' as const,
  showUnused: true,
  folding: true,
  foldingStrategy: 'indentation' as const,
  showFoldingControls: 'mouseover' as const,
  matchBrackets: 'always' as const,
  autoClosingBrackets: 'always' as const,
  autoClosingQuotes: 'always' as const,
  autoSurround: 'languageDefined' as const,
  contextmenu: true,
  mouseWheelZoom: true,
  multiCursorModifier: 'ctrlCmd' as const,
  quickSuggestions: true,
  suggestOnTriggerCharacters: true,
  acceptSuggestionOnEnter: 'on' as const,
  acceptSuggestionOnCommitCharacter: true,
  wordBasedSuggestions: true,
  formatOnPaste: true,
  formatOnType: true,
};

// JSON-specific editor options
export const JSON_EDITOR_OPTIONS = {
  ...DEFAULT_EDITOR_OPTIONS,
  language: 'json',
  formatOnPaste: true,
  formatOnType: true,
  validate: true,
  schemas: [
    {
      uri: 'http://json-schema.org/draft-07/schema#',
      fileMatch: ['*'],
      schema: {
        type: 'object',
        properties: {},
        additionalProperties: true,
      },
    },
  ],
};

// Theme configuration
export const EDITOR_THEMES = {
  light: 'vs',
  dark: 'vs-dark',
  highContrast: 'hc-black',
};

// Language configuration
export const SUPPORTED_LANGUAGES = {
  json: 'json',
  javascript: 'javascript',
  typescript: 'typescript',
  yaml: 'yaml',
  xml: 'xml',
  html: 'html',
  css: 'css',
  markdown: 'markdown',
  plaintext: 'plaintext',
};

// Monaco Editor configuration helper
export const configureMonacoEditor = (monaco: any) => {
  // Configure JSON language
  monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
    validate: true,
    allowComments: false,
    schemas: [
      {
        uri: 'http://json-schema.org/draft-07/schema#',
        fileMatch: ['*'],
        schema: {
          type: 'object',
          properties: {},
          additionalProperties: true,
        },
      },
    ],
  });

  // Configure custom theme
  monaco.editor.defineTheme('opendelivery-light', {
    base: 'vs',
    inherit: true,
    rules: [
      { token: 'comment', foreground: '6a737d', fontStyle: 'italic' },
      { token: 'keyword', foreground: 'd73a49' },
      { token: 'string', foreground: '032f62' },
      { token: 'number', foreground: '005cc5' },
      { token: 'regexp', foreground: '22863a' },
      { token: 'type', foreground: '6f42c1' },
      { token: 'delimiter', foreground: '24292e' },
      { token: 'operator', foreground: 'd73a49' },
    ],
    colors: {
      'editor.background': '#ffffff',
      'editor.foreground': '#24292e',
      'editor.lineHighlightBackground': '#f6f8fa',
      'editor.selectionBackground': '#0366d625',
      'editor.selectionHighlightBackground': '#0366d615',
      'editorLineNumber.foreground': '#1b1f2326',
      'editorLineNumber.activeForeground': '#1b1f23',
      'editorBracketMatch.background': '#34d05840',
      'editorBracketMatch.border': '#34d058',
    },
  });

  monaco.editor.defineTheme('opendelivery-dark', {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: 'comment', foreground: '6a737d', fontStyle: 'italic' },
      { token: 'keyword', foreground: 'f97583' },
      { token: 'string', foreground: '9ecbff' },
      { token: 'number', foreground: '79b8ff' },
      { token: 'regexp', foreground: '85e89d' },
      { token: 'type', foreground: 'b392f0' },
      { token: 'delimiter', foreground: 'e1e4e8' },
      { token: 'operator', foreground: 'f97583' },
    ],
    colors: {
      'editor.background': '#0d1117',
      'editor.foreground': '#e1e4e8',
      'editor.lineHighlightBackground': '#161b22',
      'editor.selectionBackground': '#0366d625',
      'editor.selectionHighlightBackground': '#0366d615',
      'editorLineNumber.foreground': '#484f5826',
      'editorLineNumber.activeForeground': '#e1e4e8',
      'editorBracketMatch.background': '#34d05840',
      'editorBracketMatch.border': '#34d058',
    },
  });
};

// Error handling for Monaco Editor
export const handleMonacoError = (error: Error): void => {
  console.error('Monaco Editor Error:', error);
  // You can implement custom error handling here
};

// Get editor height based on content
export const getEditorHeight = (content: string, minHeight = 200, maxHeight = 600): number => {
  const lines = content.split('\n').length;
  const lineHeight = 18; // Approximate line height
  const padding = 40; // Editor padding
  
  const calculatedHeight = lines * lineHeight + padding;
  
  return Math.max(minHeight, Math.min(maxHeight, calculatedHeight));
};

// Format JSON content for editor
export const formatJsonForEditor = (json: string): string => {
  try {
    const parsed = JSON.parse(json);
    return JSON.stringify(parsed, null, 2);
  } catch {
    return json;
  }
};

// Validate JSON content
export const validateJsonContent = (content: string): { valid: boolean; error?: string } => {
  try {
    JSON.parse(content);
    return { valid: true };
  } catch (error) {
    return {
      valid: false,
      error: error instanceof Error ? error.message : 'Invalid JSON format',
    };
  }
};
