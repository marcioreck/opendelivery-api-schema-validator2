import React from 'react';
import { Box, Typography, TextField } from '@mui/material';
import { monacoConfig } from '../utils/monacoConfig';

interface MonacoEditorProps {
  value?: string;
  onChange?: (value: string | undefined) => void;
  height?: string;
  language?: string;
  options?: object;
}

const MonacoEditor: React.FC<MonacoEditorProps> = ({
  value,
  onChange,
  height = '400px',
  language = 'json',
  options = {}
}) => {
  const [editorValue, setEditorValue] = React.useState(value || '');
  const [useAdvancedEditor, setUseAdvancedEditor] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  // Lazy load Monaco Editor only if needed
  const loadMonaco = React.useCallback(async () => {
    try {
      // Only load Monaco if user requests advanced features
      if (useAdvancedEditor) {
        setIsLoading(true);
        const { default: Editor } = await import('@monaco-editor/react');
        setIsLoading(false);
        return Editor;
      } else {
        // If not using advanced editor, no loading needed
        setIsLoading(false);
      }
    } catch (error) {
      console.warn('Monaco Editor failed to load, using fallback editor');
      setUseAdvancedEditor(false);
      setIsLoading(false);
    }
    return null;
  }, [useAdvancedEditor]);

  React.useEffect(() => {
    loadMonaco();
  }, [loadMonaco]);

  React.useEffect(() => {
    if (value !== undefined) {
      setEditorValue(value);
    }
  }, [value]);

  const handleChange = (newValue: string) => {
    setEditorValue(newValue);
    if (onChange) {
      onChange(newValue);
    }
  };

  const handleTextareaChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleChange(event.target.value);
  };

  const formatJSON = () => {
    try {
      const parsed = JSON.parse(editorValue);
      const formatted = JSON.stringify(parsed, null, 2);
      handleChange(formatted);
    } catch (error) {
      // Invalid JSON, keep as is
      console.warn('Invalid JSON, cannot format');
    }
  };

  const minifyJSON = () => {
    try {
      const parsed = JSON.parse(editorValue);
      const minified = JSON.stringify(parsed);
      handleChange(minified);
    } catch (error) {
      console.warn('Invalid JSON, cannot minify');
    }
  };

  const validateJSON = () => {
    try {
      JSON.parse(editorValue);
      return true;
    } catch (error) {
      return false;
    }
  };

  const toggleAdvancedEditor = () => {
    const newValue = !useAdvancedEditor;
    setUseAdvancedEditor(newValue);
    
    // Only set loading if switching to advanced mode
    if (newValue) {
      setIsLoading(true);
    }
  };

  // Simple text editor with JSON helpers
  return (
    <Box sx={{ height, display: 'flex', flexDirection: 'column' }}>
      {/* Toolbar */}
      <Box sx={{ 
        display: 'flex', 
        gap: 1, 
        mb: 1, 
        p: 1, 
        bgcolor: 'background.paper',
        borderRadius: 1,
        border: '1px solid',
        borderColor: 'divider'
      }}>
        <Typography variant="caption" color="text.secondary" sx={{ flexGrow: 1 }}>
          {language.toUpperCase()} Editor
          {!validateJSON() && editorValue && (
            <span style={{ color: 'red', marginLeft: 8 }}>⚠ Invalid JSON</span>
          )}
        </Typography>
        <button
          onClick={formatJSON}
          disabled={!validateJSON()}
          style={{
            padding: '2px 8px',
            fontSize: '11px',
            border: '1px solid #ccc',
            borderRadius: '3px',
            background: 'white',
            cursor: validateJSON() ? 'pointer' : 'not-allowed'
          }}
        >
          Format
        </button>
        <button
          onClick={minifyJSON}
          disabled={!validateJSON()}
          style={{
            padding: '2px 8px',
            fontSize: '11px',
            border: '1px solid #ccc',
            borderRadius: '3px',
            background: 'white',
            cursor: validateJSON() ? 'pointer' : 'not-allowed'
          }}
        >
          Minify
        </button>
        <button
          onClick={toggleAdvancedEditor}
          style={{
            padding: '2px 8px',
            fontSize: '11px',
            border: '1px solid #ccc',
            borderRadius: '3px',
            background: useAdvancedEditor ? '#1976d2' : 'white',
            color: useAdvancedEditor ? 'white' : 'black',
            cursor: 'pointer'
          }}
        >
          {useAdvancedEditor ? 'Simple' : 'Advanced'}
        </button>
      </Box>

      {/* Editor Area */}
      <Box sx={{ flexGrow: 1 }}>
        {useAdvancedEditor ? (
          isLoading ? (
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              height: '100%',
              bgcolor: 'background.paper',
              border: '1px solid',
              borderColor: 'divider'
            }}>
              <Typography variant="body2" color="text.secondary">
                Loading advanced editor...
              </Typography>
            </Box>
          ) : (
            <React.Suspense fallback={
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                height: '100%',
                bgcolor: 'background.paper',
                border: '1px solid',
                borderColor: 'divider'
              }}>
                <Typography variant="body2" color="text.secondary">
                  Loading Monaco Editor...
                </Typography>
              </Box>
            }>
              <MonacoAdvancedEditor
                value={editorValue}
                onChange={handleChange}
                height={height}
                language={language}
                options={{ ...monacoConfig.options, ...options }}
              />
            </React.Suspense>
          )
        ) : (
          <TextField
            fullWidth
            multiline
            rows={Math.max(10, Math.floor(parseInt(height.replace('px', '')) / 24))}
            value={editorValue}
            onChange={handleTextareaChange}
            variant="outlined"
            placeholder={`Enter your ${language.toUpperCase()} here...`}
            sx={{
              height: '100%',
              '& .MuiOutlinedInput-root': {
                height: '100%',
                fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
                fontSize: '14px',
                '& textarea': {
                  height: '100% !important',
                  resize: 'none',
                  lineHeight: 1.5
                }
              }
            }}
          />
        )}
      </Box>
    </Box>
  );
};

// Lazy loaded advanced Monaco Editor
const MonacoAdvancedEditor: React.FC<{
  value: string;
  onChange: (value: string) => void;
  height: string;
  language: string;
  options: object;
}> = ({ value, onChange, height, language, options }) => {
  const [Editor, setEditor] = React.useState<any>(null);

  React.useEffect(() => {
    const loadEditor = async () => {
      try {
        const { default: MonacoEditor } = await import('@monaco-editor/react');
        setEditor(() => MonacoEditor);
      } catch (error) {
        console.error('Failed to load Monaco Editor:', error);
      }
    };

    loadEditor();
  }, []);

  if (!Editor) {
    return (
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        height: '100%',
        bgcolor: 'background.paper',
        border: '1px solid',
        borderColor: 'divider'
      }}>
        <Typography variant="body2" color="text.secondary">
          Loading Monaco Editor...
        </Typography>
      </Box>
    );
  }

  return (
    <Editor
      height={height}
      language={language}
      value={value}
      onChange={(newValue: string | undefined) => onChange(newValue || '')}
      options={options}
      theme="vs-dark"
    />
  );
};

export default MonacoEditor;
