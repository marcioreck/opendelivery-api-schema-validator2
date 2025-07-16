// OpenDelivery Laravel Validator - Monaco Editor Component

import React, { useCallback, useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import type { MonacoEditorProps } from '@/types';
import {
  JSON_EDITOR_OPTIONS,
  configureMonacoEditor,
  handleMonacoError,
  formatJsonForEditor,
  validateJsonContent,
} from '@/utils/monaco';

const MonacoEditor: React.FC<MonacoEditorProps> = ({
  value,
  onChange,
  language = 'json',
  height = 300,
  options = {},
}) => {
  const editorRef = useRef<any>(null);
  const monacoRef = useRef<any>(null);

  // Handle editor mount
  const handleEditorDidMount = useCallback((editor: any, monaco: any) => {
    editorRef.current = editor;
    monacoRef.current = monaco;
    
    // Configure Monaco Editor
    configureMonacoEditor(monaco);
    
    // Set theme
    monaco.editor.setTheme('opendelivery-light');
    
    // Focus on editor
    editor.focus();
  }, []);

  // Handle editor change
  const handleEditorChange = useCallback((newValue: string | undefined) => {
    if (newValue !== undefined) {
      onChange(newValue);
    }
  }, [onChange]);

  // Format JSON content
  const formatContent = useCallback(() => {
    if (language === 'json' && editorRef.current) {
      const currentValue = editorRef.current.getValue();
      const formatted = formatJsonForEditor(currentValue);
      editorRef.current.setValue(formatted);
    }
  }, [language]);

  // Validate content
  const validateContent = useCallback(() => {
    if (language === 'json' && editorRef.current) {
      const currentValue = editorRef.current.getValue();
      const validation = validateJsonContent(currentValue);
      
      if (!validation.valid) {
        console.warn('JSON validation error:', validation.error);
      }
      
      return validation;
    }
    return { valid: true };
  }, [language]);

  // Add keyboard shortcuts
  useEffect(() => {
    if (editorRef.current && monacoRef.current) {
      const editor = editorRef.current;
      const monaco = monacoRef.current;
      
      // Add format command (Ctrl+Shift+F)
      editor.addAction({
        id: 'format-json',
        label: 'Format JSON',
        keybindings: [
          monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyF,
        ],
        precondition: null,
        keybindingContext: null,
        contextMenuGroupId: 'navigation',
        contextMenuOrder: 1.5,
        run: formatContent,
      });

      // Add validate command (Ctrl+Shift+V)
      editor.addAction({
        id: 'validate-json',
        label: 'Validate JSON',
        keybindings: [
          monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyV,
        ],
        precondition: null,
        keybindingContext: null,
        contextMenuGroupId: 'navigation',
        contextMenuOrder: 1.6,
        run: validateContent,
      });
    }
  }, [formatContent, validateContent]);

  // Merge editor options
  const editorOptions = {
    ...(language === 'json' ? JSON_EDITOR_OPTIONS : {}),
    ...options,
  };

  return (
    <div className="monaco-editor-container">
      <Editor
        height={height}
        language={language}
        value={value}
        onChange={handleEditorChange}
        onMount={handleEditorDidMount}
        options={editorOptions}
        loading={
          <div className="d-flex justify-content-center align-items-center" style={{ height: '100%' }}>
            <div className="opendelivery-spinner" />
          </div>
        }
        onError={handleMonacoError}
      />
    </div>
  );
};

export default MonacoEditor;
