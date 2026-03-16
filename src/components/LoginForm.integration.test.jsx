import React from 'react';
import { describe, test, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import App from '../App';

vi.mock('../charts/Barcharts', () => ({
  __esModule: true,
  default: () => <div data-testid="bar-chart" />,
}));

vi.mock('../charts/Linecharts', () => ({
  __esModule: true,
  default: () => <div data-testid="line-chart" />,
}));

vi.mock('../charts/Piechart', () => ({
  __esModule: true,
  default: ({ label }) => <div data-testid={`doughnut-chart-${label}`} />,
}));

vi.mock('../charts/PiechartViolation', () => ({
  __esModule: true,
  default: () => <div data-testid="violation-chart" />,
}));

describe('App / Login integration tests', () => {
  beforeEach(() => {
    localStorage.clear();
    window.history.pushState({}, '', '/');
  });

  //1. Login Page Integration
  test('user can login, localStorage is set, and navigates to /home with welcome text', async () => {
    const user = userEvent.setup();

    render(<App />);

    // Login page loads
    const heading = await screen.findByRole('heading', { name: /sign in/i });
    expect(heading).toBeInTheDocument();

    const sapInput = screen.getByLabelText(/sap id/i);
    const signInButton = screen.getByRole('button', { name: /sign in/i });

    // Type SAP ID and submit
    await user.type(sapInput, 'SAP12345');
    await user.click(signInButton);

    // localStorage should be set
    await waitFor(() => {
      const token = localStorage.getItem('authToken');
      const userDataRaw = localStorage.getItem('userData');

      expect(token).not.toBeNull();
      expect(userDataRaw).not.toBeNull();

      // Guard against null before parsing to avoid JSON.parse throwing
      const parsed = userDataRaw ? JSON.parse(userDataRaw) : null;
      expect(parsed).toEqual({ sapId: 'SAP12345' });
    });

    // Navigated to /home
    await waitFor(() => {
      expect(window.location.pathname).toBe('/home');
    });

    // HomePage welcome text with SAP ID
    const welcome = await screen.findByText(/welcome,/i);
    expect(welcome).toHaveTextContent('SAP12345');
  });

  // 2. Validation Integration
  test('validation error appears when submitting empty form and navigation does not occur', async () => {
    const user = userEvent.setup();

    render(<App />);

    const signInButton = await screen.findByRole('button', { name: /sign in/i });

    // Submit without SAP ID
    await user.click(signInButton);

    // Validation error
    const error = await screen.findByText(/sap id is required/i);
    expect(error).toBeInTheDocument();

    // Still on login page
    expect(window.location.pathname).toBe('/');

    // localStorage should not be updated
    expect(localStorage.getItem('authToken')).toBeNull();
    expect(localStorage.getItem('userData')).toBeNull();
  });

  // 3. Protected Route Integration
  test('unauthenticated access to /home redirects to login page', async () => {
    localStorage.clear();
    window.history.pushState({}, '', '/home');

    render(<App />);

    const heading = await screen.findByRole('heading', { name: /sign in/i });
    expect(heading).toBeInTheDocument();

    await waitFor(() => {
      expect(window.location.pathname).toBe('/');
    });
  });

  // 4. Logout Flow Integration
  test('logout clears localStorage and redirects to login page', async () => {
    const user = userEvent.setup();

    // Pre-populate localStorage
    const mockUser = { sapId: 'LOGOUT123' };
    localStorage.setItem('authToken', 'token_test_LOGOUT123');
    localStorage.setItem('userData', JSON.stringify(mockUser));

    window.history.pushState({}, '', '/home');

    render(<App />);

    // HomePage loads
    const welcome = await screen.findByText(/welcome,/i);
    expect(welcome).toHaveTextContent('LOGOUT123');

    const logoutButton = screen.getByRole('button', { name: /logout/i });

    await user.click(logoutButton);

    // localStorage cleared
    await waitFor(() => {
      expect(localStorage.getItem('authToken')).toBeNull();
      expect(localStorage.getItem('userData')).toBeNull();
    });

    // Redirected to login page
    const loginHeading = await screen.findByRole('heading', { name: /sign in/i });
    expect(loginHeading).toBeInTheDocument();

    await waitFor(() => {
      expect(window.location.pathname).toBe('/');
    });
  });
});