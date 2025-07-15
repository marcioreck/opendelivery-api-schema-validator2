import React from 'react';
import { Box, Typography, TextField } from '@mui/material';
import Editor from '@monaco-editor/react';

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
  const [fallbackValue, setFallbackValue] = React.useState(value || '');
  const [useTextarea, setUseTextarea] = React.useState(false);

  const handleEditorMount = (editor: any) => {
    // Editor mounted successfully
    console.log('Monaco Editor mounted successfully');
  };

  const handleEditorError = (error: any) => {
    console.error('Monaco Editor error:', error);
    // Fall back to textarea if Monaco fails
    setUseTextarea(true);
  };

  const handleFallbackChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setFallbackValue(newValue);
    if (onChange) {
      onChange(newValue);
    }
  };

  if (useTextarea) {
    return (
      <Box sx={{ height }}>
        <TextField
          fullWidth
          multiline
          rows={Math.floor(parseInt(height) / 24)}
          value={fallbackValue}
          onChange={handleFallbackChange}
          variant="outlined"
          placeholder="Enter your JSON here..."
          sx={{
            '& .MuiOutlinedInput-root': {
              height: '100%',
              fontFamily: 'monospace',
              fontSize: '14px',
              '& textarea': {
                height: '100% !important',
                resize: 'none'
              }
            }
          }}
        />
      </Box>
    );
  }

  return (
    <Box sx={{ height }}>
      <Editor
        height={height}
        language={language}
        value={value}
        onChange={onChange}
        onMount={handleEditorMount}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          scrollBeyondLastLine: false,
          automaticLayout: true,
          wordWrap: 'on',
          lineNumbers: 'on',
          folding: true,
          ...options
        }}
        theme="vs-dark"
        loading={
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
              Loading editor...
            </Typography>
          </Box>
        }
        onError={handleEditorError}
      />
    </Box>
  );
};

export default MonacoEditor;
