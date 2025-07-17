// OpenDelivery API Schema Validator 2 - Monaco Editor Component

import React, { useRef, useEffect, useState } from 'react';
import { Editor } from '@monaco-editor/react';
import { Box, Alert, IconButton, Tooltip } from '@mui/material';
import { 
  Fullscreen as FullscreenIcon,
  FullscreenExit as FullscreenExitIcon,
  FormatAlignLeft as FormatIcon,
  ContentCopy as CopyIcon,
} from '@mui/icons-material';
import { formatJsonForEditor, validateJsonContent } from '@/utils/monaco';
import type { MonacoEditorProps } from '@/types';

const MonacoEditor: React.FC<MonacoEditorProps> = ({
  value,
  onChange,
  language = 'json',
  height = 400,
  options = {},
}) => {
  const editorRef = useRef<any>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);

  // Default editor options
  const defaultOptions = {
    fontSize: 14,
    lineHeight: 1.5,
    fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
    wordWrap: 'on' as const,
    minimap: { enabled: false },
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
    ...options,
  };

  // Handle editor mount
  const handleEditorDidMount = (editor: any, monaco: any) => {
    editorRef.current = editor;
    
    // Configure JSON language
    if (language === 'json') {
      monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
        validate: true,
        allowComments: false,
        schemas: [],
        enableSchemaRequest: false,
      });
    }
  };

  // Handle value change
  const handleValueChange = (newValue: string | undefined) => {
    if (!newValue) return;
    
    // Validate JSON if language is json
    if (language === 'json') {
      const validation = validateJsonContent(newValue);
      setValidationError(validation.valid ? null : validation.error || 'Invalid JSON');
    }
    
    onChange(newValue);
  };

  // Format JSON
  const formatJson = () => {
    if (!editorRef.current || language !== 'json') return;
    
    try {
      const formatted = formatJsonForEditor(value);
      editorRef.current.setValue(formatted);
      onChange(formatted);
    } catch (error) {
      setValidationError('Cannot format invalid JSON');
    }
  };

  // Copy to clipboard
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };

  // Toggle fullscreen
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey || event.metaKey) {
        switch (event.key) {
          case 'f':
            if (event.altKey) {
              event.preventDefault();
              formatJson();
            }
            break;
          case 'Enter':
            if (event.shiftKey) {
              event.preventDefault();
              toggleFullscreen();
            }
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [value]);

  return (
    <Box
      sx={{
        position: isFullscreen ? 'fixed' : 'relative',
        top: isFullscreen ? 0 : 'auto',
        left: isFullscreen ? 0 : 'auto',
        right: isFullscreen ? 0 : 'auto',
        bottom: isFullscreen ? 0 : 'auto',
        width: isFullscreen ? '100vw' : '100%',
        height: isFullscreen ? '100vh' : height,
        zIndex: isFullscreen ? 9999 : 'auto',
        backgroundColor: 'background.paper',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: isFullscreen ? 0 : 1,
        overflow: 'hidden',
      }}
    >
      {/* Toolbar */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '4px 8px',
          backgroundColor: 'grey.50',
          borderBottom: '1px solid',
          borderBottomColor: 'divider',
          minHeight: 40,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
            {language.toUpperCase()}
          </Box>
          
          {validationError && (
            <Box sx={{ fontSize: '0.75rem', color: 'error.main' }}>
              • {validationError}
            </Box>
          )}
          
          {copySuccess && (
            <Box sx={{ fontSize: '0.75rem', color: 'success.main' }}>
              • Copied!
            </Box>
          )}
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          {language === 'json' && (
            <Tooltip title="Format JSON (Ctrl+Alt+F)">
              <IconButton size="small" onClick={formatJson}>
                <FormatIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
          
          <Tooltip title="Copy to clipboard">
            <IconButton size="small" onClick={copyToClipboard}>
              <CopyIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          
          <Tooltip title={isFullscreen ? "Exit fullscreen (Shift+Enter)" : "Enter fullscreen (Shift+Enter)"}>
            <IconButton size="small" onClick={toggleFullscreen}>
              {isFullscreen ? <FullscreenExitIcon fontSize="small" /> : <FullscreenIcon fontSize="small" />}
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Validation Error Alert */}
      {validationError && (
        <Alert severity="error" sx={{ borderRadius: 0, mb: 0 }}>
          JSON Validation Error: {validationError}
        </Alert>
      )}

      {/* Editor */}
      <Box sx={{ height: isFullscreen ? 'calc(100vh - 40px)' : `${height - 40}px` }}>
        <Editor
          height="100%"
          language={language}
          value={value}
          onChange={handleValueChange}
          onMount={handleEditorDidMount}
          options={defaultOptions}
          theme="vs-light"
          loading={
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              height: '100%',
              color: 'text.secondary',
            }}>
              Loading Monaco Editor...
            </Box>
          }
        />
      </Box>
    </Box>
  );
};

export default MonacoEditor;
