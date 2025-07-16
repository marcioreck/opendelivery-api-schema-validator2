// OpenDelivery API Schema Validator 2 - Main Entry Point

import React from 'react';
import ReactDOM from 'react-dom/client';
import OpenDeliveryApp from './App';
import '../css/app.css';

// Initialize the React app
const root = ReactDOM.createRoot(
  document.getElementById('opendelivery-app') as HTMLElement
);

root.render(
  <React.StrictMode>
    <OpenDeliveryApp />
  </React.StrictMode>
);

// Export components for potential external use
export { default as App } from './App';
export { default as ValidationForm } from './components/ValidationForm';
export { default as Navbar } from './components/Navbar';
export { default as MonacoEditor } from './components/MonacoEditor';
export * from './types';
export * from './utils/api';
