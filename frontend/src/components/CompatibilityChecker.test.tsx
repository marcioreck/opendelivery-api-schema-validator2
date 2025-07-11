import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import CompatibilityChecker from './CompatibilityChecker';
import { validatePayload } from '../api';

// Mock da API
vi.mock('../api', () => ({
  validatePayload: vi.fn(),
}));

const mockValidatePayload = vi.mocked(validatePayload);

describe('CompatibilityChecker Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the compatibility checker interface', () => {
    render(<CompatibilityChecker />);
    
    expect(screen.getByText('Verificador de Compatibilidade')).toBeInTheDocument();
    expect(screen.getByText(/Este verificador testa a compatibilidade/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Executar Verificação de Compatibilidade/i })).toBeInTheDocument();
  });

  it('shows progress when running compatibility test', async () => {
    mockValidatePayload.mockImplementation(() => 
      new Promise(resolve => setTimeout(() => resolve({ status: 'success', message: 'Valid' }), 100))
    );

    render(<CompatibilityChecker />);
    
    const button = screen.getByRole('button', { name: /Executar Verificação de Compatibilidade/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText(/Executando Verificação/)).toBeInTheDocument();
    });
  });

  it('displays results after compatibility test', async () => {
    mockValidatePayload.mockResolvedValue({
      status: 'success',
      message: 'Validation successful'
    });

    render(<CompatibilityChecker />);
    
    const button = screen.getByRole('button', { name: /Executar Verificação de Compatibilidade/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText(/Resumo dos Resultados/)).toBeInTheDocument();
    }, { timeout: 5000 });
  });

  it('handles successful validation results', async () => {
    mockValidatePayload.mockResolvedValue({
      status: 'success',
      message: 'Validation successful'
    });

    render(<CompatibilityChecker />);
    
    const button = screen.getByRole('button', { name: /Executar Verificação de Compatibilidade/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText(/Versões Compatíveis/)).toBeInTheDocument();
    }, { timeout: 5000 });
  });

  it('handles validation errors', async () => {
    mockValidatePayload.mockResolvedValue({
      status: 'error',
      message: 'Validation failed'
    });

    render(<CompatibilityChecker />);
    
    const button = screen.getByRole('button', { name: /Executar Verificação de Compatibilidade/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText(/Resultados Detalhados por Versão/)).toBeInTheDocument();
    }, { timeout: 5000 });
  });

  it('shows summary statistics', async () => {
    mockValidatePayload.mockResolvedValue({
      status: 'success',
      message: 'Validation successful'
    });

    render(<CompatibilityChecker />);
    
    const button = screen.getByRole('button', { name: /Executar Verificação de Compatibilidade/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText(/Taxa de Compatibilidade/)).toBeInTheDocument();
      expect(screen.getByText(/Nível de Compatibilidade/)).toBeInTheDocument();
    }, { timeout: 5000 });
  });

  it('starts compatibility test when button is clicked', async () => {
    mockValidatePayload.mockResolvedValue({
      status: 'success',
      message: 'Valid'
    });

    render(<CompatibilityChecker />);
    
    const button = screen.getByRole('button', { name: /Executar Verificação de Compatibilidade/i });
    expect(button).not.toBeDisabled();
    
    fireEvent.click(button);
    
    await waitFor(() => {
      expect(mockValidatePayload).toHaveBeenCalled();
    });
  });

  it('disables button while test is running', async () => {
    mockValidatePayload.mockImplementation(() => 
      new Promise(resolve => setTimeout(() => resolve({ status: 'success', message: 'Valid' }), 100))
    );

    render(<CompatibilityChecker />);
    
    const button = screen.getByRole('button', { name: /Executar Verificação de Compatibilidade/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Executando Verificação/i })).toBeDisabled();
    });
  });
}); 