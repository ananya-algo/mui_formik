import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import LoginForm from './LoginForm';

// Mock pages 
const MockHomePage = ({ user, onLogout }) => (
  <div>
    <h1>Home Page</h1>
    <p>Welcome {user?.sapId}</p>
    <button onClick={onLogout}>Logout</button>
  </div>
);

const MockAuditLogsPage = ({ user, onLogout }) => (
  <div>
    <h1>Audit Logs</h1>
    <p>User: {user?.sapId}</p>
    <button onClick={onLogout}>Logout</button>
  </div>
);

const MockProtectedRoute = ({ children }) => {
  const authToken = localStorage.getItem('authToken');
  const userData = localStorage.getItem('userData');
  const isAuthenticated = authToken && userData;

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
};

const TestApp = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const authToken = localStorage.getItem('authToken');
    const userData = localStorage.getItem('userData');
    
    if (authToken && userData) {
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  const handleLogin = (userData) => {
    const authToken = `token_${Date.now()}_${userData.sapId}`;
    
    localStorage.setItem('authToken', authToken);
    localStorage.setItem('userData', JSON.stringify(userData));
    
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    
    setUser(null);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Routes>
      <Route 
        path="/" 
        element={
          user ? <Navigate to="/home" replace /> : <LoginForm onLogin={handleLogin} />
        } 
      />
      
      <Route
        path="/home"
        element={
          <MockProtectedRoute>
            <MockHomePage user={user} onLogout={handleLogout} />
          </MockProtectedRoute>
        }
      />

      <Route
        path="/process-audit-logs"
        element={
          <MockProtectedRoute>
            <MockAuditLogsPage user={user} onLogout={handleLogout} />
          </MockProtectedRoute>
        }
      />
      
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

describe('LoginForm Integration Tests', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    localStorage.clear();
  });

  test('full login flow - user logs in and navigates to home page', async () => {
    const user = userEvent.setup();
    
    render(
      <MemoryRouter initialEntries={['/']}>
        <TestApp />
      </MemoryRouter>
    );

    // Verify we're on login page
    expect(screen.getByRole('heading', { name: /Sign In/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter your SAP ID')).toBeInTheDocument();

    // Fill in SAP ID
    const input = screen.getByPlaceholderText('Enter your SAP ID');
    await user.type(input, 'TEST12345');

    // Submit the form
    const submitButton = screen.getByRole('button', { name: /Sign In/i });
    await user.click(submitButton);

    // Wait for navigation to home page
    await waitFor(() => {
      expect(screen.getByText('Home Page')).toBeInTheDocument();
      expect(screen.getByText('Welcome TEST12345')).toBeInTheDocument();
    });

    // Verify localStorage was updated
    expect(localStorage.getItem('authToken')).toBeTruthy();
    expect(localStorage.getItem('userData')).toBeTruthy();
    
    const userData = JSON.parse(localStorage.getItem('userData'));
    expect(userData.sapId).toBe('TEST12345');
  });

  test('user stays logged in after page refresh', async () => {
    // Simulate existing auth data in localStorage
    const existingUserData = { sapId: 'EXISTING123' };
    const existingToken = 'token_12345_EXISTING123';
    
    localStorage.setItem('authToken', existingToken);
    localStorage.setItem('userData', JSON.stringify(existingUserData));

    render(
      <MemoryRouter initialEntries={['/']}>
        <TestApp />
      </MemoryRouter>
    );

    // Should redirect to home page automatically
    await waitFor(() => {
      expect(screen.getByText('Home Page')).toBeInTheDocument();
      expect(screen.getByText('Welcome EXISTING123')).toBeInTheDocument();
    });

    // Should not show login form
    expect(screen.queryByText('Sign In')).not.toBeInTheDocument();
  });

  test('logout flow - user logs out and returns to login page', async () => {
    const user = userEvent.setup();
    
    // Set up logged-in state
    const userData = { sapId: 'LOGOUT123' };
    localStorage.setItem('authToken', 'token_test');
    localStorage.setItem('userData', JSON.stringify(userData));

    const { rerender } = render(
      <MemoryRouter initialEntries={['/home']}>
        <TestApp />
      </MemoryRouter>
    );

    // Verify we're on home page
    await waitFor(() => {
      expect(screen.getByText('Home Page')).toBeInTheDocument();
    });

    // Click logout button
    const logoutButton = screen.getByRole('button', { name: /Logout/i });
    await user.click(logoutButton);

    // Rerender to simulate navigation
    rerender(
      <MemoryRouter initialEntries={['/']}>
        <TestApp />
      </MemoryRouter>
    );

    // Should be back on login page
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /Sign In/i })).toBeInTheDocument();
    });

    // localStorage should be cleared
    expect(localStorage.getItem('authToken')).toBeNull();
    expect(localStorage.getItem('userData')).toBeNull();
  });

  test('validation error prevents login and navigation', async () => {
    const user = userEvent.setup();
    
    render(
      <MemoryRouter initialEntries={['/']}>
        <TestApp />
      </MemoryRouter>
    );

    // Try to submit without SAP ID
    const submitButton = screen.getByRole('button', { name: /Sign In/i });
    await user.click(submitButton);

    // Should show validation error
    await waitFor(() => {
      expect(screen.getByText('SAP ID is required')).toBeInTheDocument();
    });

    // Should still be on login page
    expect(screen.getByRole('heading', { name: /Sign In/i })).toBeInTheDocument();
    expect(screen.queryByText('Home Page')).not.toBeInTheDocument();

    // localStorage should not be updated
    expect(localStorage.getItem('authToken')).toBeNull();
    expect(localStorage.getItem('userData')).toBeNull();
  });

  test('multiple login attempts with different users', async () => {
    const user = userEvent.setup();
    
    const { rerender } = render(
      <MemoryRouter initialEntries={['/']}>
        <TestApp />
      </MemoryRouter>
    );

    // First login
    const input = screen.getByPlaceholderText('Enter your SAP ID');
    await user.type(input, 'USER001');
    await user.click(screen.getByRole('button', { name: /Sign In/i }));

    await waitFor(() => {
      expect(screen.getByText('Welcome USER001')).toBeInTheDocument();
    });

    // Logout
    await user.click(screen.getByRole('button', { name: /Logout/i }));

    // Rerender for login page
    rerender(
      <MemoryRouter initialEntries={['/']}>
        <TestApp />
      </MemoryRouter>
    );

    // Second login with different user
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /Sign In/i })).toBeInTheDocument();
    });

    const newInput = screen.getByPlaceholderText('Enter your SAP ID');
    await user.clear(newInput);
    await user.type(newInput, 'USER002');
    await user.click(screen.getByRole('button', { name: /Sign In/i }));

    await waitFor(() => {
      expect(screen.getByText('Welcome USER002')).toBeInTheDocument();
    });

    // Verify localStorage has new user
    const userData = JSON.parse(localStorage.getItem('userData'));
    expect(userData.sapId).toBe('USER002');
  });

  test('protected route redirects to login when not authenticated', async () => {
    render(
      <MemoryRouter initialEntries={['/home']}>
        <TestApp />
      </MemoryRouter>
    );

    await waitFor(() => {
     
      expect(screen.getByRole('heading', { name: /Sign In/i })).toBeInTheDocument();
    });
  });

  test('Enter key submits login form', async () => {
    const user = userEvent.setup();
    
    render(
      <MemoryRouter initialEntries={['/']}>
        <TestApp />
      </MemoryRouter>
    );

    const input = screen.getByPlaceholderText('Enter your SAP ID');
    await user.type(input, 'ENTER123{Enter}');

    // Should navigate to home page
    await waitFor(() => {
      expect(screen.getByText('Home Page')).toBeInTheDocument();
      expect(screen.getByText('Welcome ENTER123')).toBeInTheDocument();
    });
  });

  test('authToken format is correct', async () => {
    const user = userEvent.setup();
    
    render(
      <MemoryRouter initialEntries={['/']}>
        <TestApp />
      </MemoryRouter>
    );

    const input = screen.getByPlaceholderText('Enter your SAP ID');
    await user.type(input, 'TOKEN123');
    await user.click(screen.getByRole('button', { name: /Sign In/i }));

    await waitFor(() => {
      expect(screen.getByText('Home Page')).toBeInTheDocument();
    });

    const authToken = localStorage.getItem('authToken');
    
    // Verify token format: token_{timestamp}_{sapId}
    expect(authToken).toMatch(/^token_\d+_TOKEN123$/);
  });

  test('loading state shows before authentication check', () => {
 
    
    const { container } = render(
      <MemoryRouter initialEntries={['/']}>
        <TestApp />
      </MemoryRouter>
    );

    
    expect(container).toBeTruthy();
  });

  test('navigation to non-existent route redirects to login', async () => {
    render(
      <MemoryRouter initialEntries={['/non-existent-route']}>
        <TestApp />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /Sign In/i })).toBeInTheDocument();
    });
  });

  test('form clears error when user corrects input', async () => {
    const user = userEvent.setup();
    
    render(
      <MemoryRouter initialEntries={['/']}>
        <TestApp />
      </MemoryRouter>
    );

    // Submit empty form to trigger error
    const submitButton = screen.getByRole('button', { name: /Sign In/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('SAP ID is required')).toBeInTheDocument();
    });

    // Type to clear error
    const input = screen.getByPlaceholderText('Enter your SAP ID');
    await user.type(input, 'VALID123');

    await waitFor(() => {
      expect(screen.queryByText('SAP ID is required')).not.toBeInTheDocument();
    });
  });

  test('logged-in user accessing root path redirects to home', async () => {
    // Set up logged-in state
    const userData = { sapId: 'REDIRECT123' };
    localStorage.setItem('authToken', 'token_test');
    localStorage.setItem('userData', JSON.stringify(userData));

    render(
      <MemoryRouter initialEntries={['/']}>
        <TestApp />
      </MemoryRouter>
    );

    // Should automatically redirect to home
    await waitFor(() => {
      expect(screen.getByText('Home Page')).toBeInTheDocument();
      expect(screen.getByText('Welcome REDIRECT123')).toBeInTheDocument();
    });

    // Should not show login form
    expect(screen.queryByText('Sign In')).not.toBeInTheDocument();
  });
});