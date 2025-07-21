// OpenDelivery API Schema Validator 2 - Simple Text Editor Component

import React from 'react';
import { Box, TextField } from '@mui/material';
import type { MonacoEditorProps } from '@/types';

const MonacoEditor: React.FC<MonacoEditorProps> = ({
  value,
  onChange,
  language = 'json',
  height = 400,
}) => {
  console.log('📝 Simple Editor - Value length:', value?.length, 'characters');

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = event.target.value;
    console.log('📝 Simple Editor - Changed to:', newValue?.length, 'characters');
    if (onChange) {
      onChange(newValue);
    }
  };

  return (
    <Box sx={{ width: '100%', height: typeof height === 'number' ? `${height}px` : height }}>
      <TextField
        multiline
        fullWidth
        variant="outlined"
        value={value || ''}
        onChange={handleChange}
        placeholder={`Enter ${language.toUpperCase()} here...`}
        sx={{
          height: '100%',
          '& .MuiInputBase-root': {
            height: '100%',
            alignItems: 'flex-start',
            padding: '16px',
          },
          '& .MuiInputBase-input': {
            height: '100% !important',
            overflow: 'auto !important',
            fontFamily: 'Monaco, Menlo, "Courier New", monospace',
            fontSize: '16px', // Aumentado de 14px para 16px
            lineHeight: 1.6, // Aumentado de 1.5 para 1.6
            resize: 'none',
            padding: '0 !important',
          },
          '& .MuiOutlinedInput-root': {
            fontSize: '16px',
          },
        }}
        inputProps={{
          style: {
            height: typeof height === 'number' ? `${height - 40}px` : 'calc(100% - 40px)',
            minHeight: '300px', // Altura mínima garantida
          }
        }}
      />
    </Box>
  );
};

export default MonacoEditor;
