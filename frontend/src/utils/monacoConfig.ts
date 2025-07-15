// Configuração simplificada do Monaco Editor
// Removida dependência externa do CDN

export const monacoConfig = {
  // Configuração local sem CDN
  local: true,
  
  // Configurações básicas para funcionar offline
  theme: 'vs-dark',
  language: 'json',
  options: {
    minimap: { enabled: false },
    fontSize: 14,
    scrollBeyondLastLine: false,
    automaticLayout: true,
    wordWrap: 'on',
    lineNumbers: 'on',
    folding: true,
    contextmenu: false,
    quickSuggestions: false,
    parameterHints: { enabled: false },
    suggestOnTriggerCharacters: false,
    acceptSuggestionOnEnter: 'off',
    tabCompletion: 'off',
    wordBasedSuggestions: false,
    occurrencesHighlight: false,
    codeLens: false,
    hover: { enabled: false },
    links: false,
    colorDecorators: false,
    lightbulb: { enabled: false },
    snippetSuggestions: 'none'
  }
};

export default monacoConfig;
