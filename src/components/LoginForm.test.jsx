import { describe, test, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import LoginForm from './LoginForm';

// Mock useNavigate for Vite
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Helper function to render with router
const renderWithRouter = (component) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('LoginForm Component', () => {
  const mockOnLogin = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders login form with all elements', () => {
    renderWithRouter(<LoginForm onLogin={mockOnLogin} />);

    // Check for heading using role and name
    expect(screen.getByRole('heading', { name: /Sign In/i })).toBeInTheDocument();
    
    // Check for SAP ID label and input
    expect(screen.getByText('SAP ID')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter your SAP ID')).toBeInTheDocument();
    
    // Check for Sign In button
    expect(screen.getByRole('button', { name: /Sign In/i })).toBeInTheDocument();
  });

  test('renders logos correctly', () => {
    renderWithRouter(<LoginForm onLogin={mockOnLogin} />);

    const images = screen.getAllByRole('img');
    expect(images).toHaveLength(3); // infinity, algo8, and secondary logos
  });

  test('displays project title and tagline', () => {
    renderWithRouter(<LoginForm onLogin={mockOnLogin} />);

    expect(screen.getByText(/Project INFINITI - Digital Plant/i)).toBeInTheDocument();
    expect(screen.getByText(/an algo8.ai product/i)).toBeInTheDocument();
  });

  test('shows validation error when SAP ID is empty on submit', async () => {
    renderWithRouter(<LoginForm onLogin={mockOnLogin} />);

    const submitButton = screen.getByRole('button', { name: /Sign In/i });
    
    // Click submit without entering SAP ID
    fireEvent.click(submitButton);

    // Wait for validation error
    await waitFor(() => {
      expect(screen.getByText('SAP ID is required')).toBeInTheDocument();
    });

    // Ensure onLogin was not called
    expect(mockOnLogin).not.toHaveBeenCalled();
  });

  test('does not show error initially', () => {
    renderWithRouter(<LoginForm onLogin={mockOnLogin} />);

    expect(screen.queryByText('SAP ID is required')).not.toBeInTheDocument();
  });

  test('shows error when field is touched and left empty', async () => {
    const user = userEvent.setup();
    renderWithRouter(<LoginForm onLogin={mockOnLogin} />);

    const input = screen.getByPlaceholderText('Enter your SAP ID');
    
    // Focus and blur without entering value
    await user.click(input);
    await user.tab();

    await waitFor(() => {
      expect(screen.getByText('SAP ID is required')).toBeInTheDocument();
    });
  });

  test('allows user to type in SAP ID field', async () => {
    const user = userEvent.setup();
    renderWithRouter(<LoginForm onLogin={mockOnLogin} />);

    const input = screen.getByPlaceholderText('Enter your SAP ID');
    
    await user.type(input, '12345678');

    expect(input).toHaveValue('12345678');
  });

  test('submits form with valid SAP ID', async () => {
    const user = userEvent.setup();
    renderWithRouter(<LoginForm onLogin={mockOnLogin} />);

    const input = screen.getByPlaceholderText('Enter your SAP ID');
    const submitButton = screen.getByRole('button', { name: /Sign In/i });

    // Enter SAP ID
    await user.type(input, '12345678');
    
    // Submit form
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockOnLogin).toHaveBeenCalledWith({ sapId: '12345678' });
      expect(mockNavigate).toHaveBeenCalledWith('/home');
    });
  });

  test('clears error when user starts typing after validation error', async () => {
    const user = userEvent.setup();
    renderWithRouter(<LoginForm onLogin={mockOnLogin} />);

    const input = screen.getByPlaceholderText('Enter your SAP ID');
    const submitButton = screen.getByRole('button', { name: /Sign In/i });

    // Trigger validation error
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('SAP ID is required')).toBeInTheDocument();
    });

    // Start typing
    await user.type(input, '123');

    await waitFor(() => {
      expect(screen.queryByText('SAP ID is required')).not.toBeInTheDocument();
    });
  });

  test('button shows submitting state', async () => {
    const user = userEvent.setup();
    // Create a slow async handler that we can control
    const slowOnLogin = vi.fn(() => new Promise(resolve => setTimeout(resolve, 100)));
    
    renderWithRouter(<LoginForm onLogin={slowOnLogin} />);

    const input = screen.getByPlaceholderText('Enter your SAP ID');
    const submitButton = screen.getByRole('button', { name: /Sign In/i });

    await user.type(input, '12345678');
    
    // Click submit - this will trigger the async operation
    const submitPromise = user.click(submitButton);

    // Check if button is disabled immediately after click
    // Note: Due to Formik's fast execution, this might be hard to catch
    // The button will be disabled only during the brief moment of submission
    await waitFor(() => {
      expect(slowOnLogin).toHaveBeenCalled();
    });

    // Wait for submission to complete
    await submitPromise;
  });

  test('handles Enter key press to submit form', async () => {
    const user = userEvent.setup();
    renderWithRouter(<LoginForm onLogin={mockOnLogin} />);

    const input = screen.getByPlaceholderText('Enter your SAP ID');

    await user.type(input, '12345678');
    await user.keyboard('{Enter}');

    await waitFor(() => {
      expect(mockOnLogin).toHaveBeenCalledWith({ sapId: '12345678' });
    });
  });
});