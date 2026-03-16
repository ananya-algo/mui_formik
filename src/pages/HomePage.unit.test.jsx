import { describe, test, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import HomePage from './HomePage';

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock child components
vi.mock('../components/DashboardHeader', () => ({
  default: ({ onBack, onMonthClick, onDateRangeChange, onDownload }) => (
    <div data-testid="dashboard-header">
      <button onClick={onBack} data-testid="back-button">Back</button>
      <button onClick={onMonthClick} data-testid="month-button">This Month</button>
      <input 
        type="date" 
        onChange={onDateRangeChange} 
        data-testid="date-input"
      />
      <button onClick={onDownload} data-testid="download-button">Download</button>
    </div>
  )
}));

vi.mock('../charts/Barcharts', () => ({
  default: ({ data, title }) => (
    <div data-testid="bar-chart">
      <h3>{title}</h3>
      <div data-testid="bar-chart-data">{JSON.stringify(data)}</div>
    </div>
  )
}));

vi.mock('../charts/Linecharts', () => ({
  default: ({ data, title }) => (
    <div data-testid="line-chart">
      <h3>{title}</h3>
      <div data-testid="line-chart-data">{JSON.stringify(data)}</div>
    </div>
  )
}));

vi.mock('../charts/Piechart', () => ({
  default: ({ percentage, label, color }) => (
    <div data-testid="doughnut-chart">
      <p data-testid="doughnut-label">{label}</p>
      <p data-testid="doughnut-percentage">{percentage}%</p>
      <p data-testid="doughnut-color">{color}</p>
    </div>
  )
}));

vi.mock('../charts/PiechartViolation', () => ({
  default: () => (
    <div data-testid="violation-chart">
      Violation Chart
    </div>
  )
}));

// Helper function to render with router
const renderWithRouter = (component) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('HomePage Component - Unit Tests', () => {
  const mockUser = { sapId: 'TEST12345' };
  const mockOnLogout = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering Tests', () => {
    test('renders homepage with all main sections', () => {
      renderWithRouter(<HomePage user={mockUser} onLogout={mockOnLogout} />);

      // Check navbar
      expect(screen.getByText('Project INFINITI - Digital Plant')).toBeInTheDocument();
      
      // Check user info
      expect(screen.getByText('Welcome,')).toBeInTheDocument();
      expect(screen.getByText('TEST12345')).toBeInTheDocument();
      
      // Check logout button
      expect(screen.getByRole('button', { name: /Logout/i })).toBeInTheDocument();
    });

    test('renders dashboard header component', () => {
      renderWithRouter(<HomePage user={mockUser} onLogout={mockOnLogout} />);

      expect(screen.getByTestId('dashboard-header')).toBeInTheDocument();
      expect(screen.getByTestId('back-button')).toBeInTheDocument();
      expect(screen.getByTestId('month-button')).toBeInTheDocument();
      expect(screen.getByTestId('date-input')).toBeInTheDocument();
      expect(screen.getByTestId('download-button')).toBeInTheDocument();
    });

    test('renders bar chart with daily summary data', () => {
      renderWithRouter(<HomePage user={mockUser} onLogout={mockOnLogout} />);

      const barChart = screen.getByTestId('bar-chart');
      expect(barChart).toBeInTheDocument();
      expect(within(barChart).getByText('Daily Summary')).toBeInTheDocument();
    });

    test('renders line chart with monthly summary data', () => {
      renderWithRouter(<HomePage user={mockUser} onLogout={mockOnLogout} />);

      const lineChart = screen.getByTestId('line-chart');
      expect(lineChart).toBeInTheDocument();
      expect(within(lineChart).getByText('Monthly Summary')).toBeInTheDocument();
    });

    test('renders all three doughnut charts with correct data', () => {
      renderWithRouter(<HomePage user={mockUser} onLogout={mockOnLogout} />);

      const doughnutCharts = screen.getAllByTestId('doughnut-chart');
      expect(doughnutCharts).toHaveLength(3);

      // Check Monthly Plan Compliance
      expect(screen.getByText('Monthly Plan Compliance')).toBeInTheDocument();
      expect(screen.getByText('89.86%')).toBeInTheDocument();

      // Check MTD Plant Quality Rating
      expect(screen.getByText('MTD Plant Quality Rating')).toBeInTheDocument();
      expect(screen.getByText('93.8%')).toBeInTheDocument();

      // Check YTD Plant Quality Rating
      expect(screen.getByText('YTD Plant Quality Rating')).toBeInTheDocument();
      expect(screen.getByText('92.9%')).toBeInTheDocument();
    });

    test('renders violation chart', () => {
      renderWithRouter(<HomePage user={mockUser} onLogout={mockOnLogout} />);

      expect(screen.getByTestId('violation-chart')).toBeInTheDocument();
      expect(screen.getByText('Violation Chart')).toBeInTheDocument();
    });

    test('renders with default user when user prop is not provided', () => {
      renderWithRouter(<HomePage onLogout={mockOnLogout} />);

      expect(screen.getByText('Unknown')).toBeInTheDocument();
    });

    test('displays user SAP ID correctly in navbar', () => {
      renderWithRouter(<HomePage user={mockUser} onLogout={mockOnLogout} />);

      const userInfo = screen.getByText('TEST12345');
      expect(userInfo).toBeInTheDocument();
      expect(userInfo.tagName).toBe('STRONG');
    });
  });

  describe('User Interaction Tests', () => {
    test('calls onLogout and navigates when logout button is clicked', async () => {
      const user = userEvent.setup();
      renderWithRouter(<HomePage user={mockUser} onLogout={mockOnLogout} />);

      const logoutButton = screen.getByRole('button', { name: /Logout/i });
      await user.click(logoutButton);

      expect(mockOnLogout).toHaveBeenCalledTimes(1);
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });

    test('navigates to root when back button is clicked', async () => {
      const user = userEvent.setup();
      renderWithRouter(<HomePage user={mockUser} onLogout={mockOnLogout} />);

      const backButton = screen.getByTestId('back-button');
      await user.click(backButton);

      expect(mockNavigate).toHaveBeenCalledWith('/');
    });

    test('handles month button click', async () => {
      const consoleSpy = vi.spyOn(console, 'log');
      const user = userEvent.setup();
      renderWithRouter(<HomePage user={mockUser} onLogout={mockOnLogout} />);

      const monthButton = screen.getByTestId('month-button');
      await user.click(monthButton);

      expect(consoleSpy).toHaveBeenCalledWith('This Month button clicked');
      consoleSpy.mockRestore();
    });

    test('handles date range change', async () => {
      const consoleSpy = vi.spyOn(console, 'log');
      const user = userEvent.setup();
      renderWithRouter(<HomePage user={mockUser} onLogout={mockOnLogout} />);

      const dateInput = screen.getByTestId('date-input');
      await user.type(dateInput, '2025-01-15');

      expect(consoleSpy).toHaveBeenCalledWith(
        'Date range changed:',
        expect.any(String)
      );
      consoleSpy.mockRestore();
    });

    test('handles download button click', async () => {
      const consoleSpy = vi.spyOn(console, 'log');
      const user = userEvent.setup();
      renderWithRouter(<HomePage user={mockUser} onLogout={mockOnLogout} />);

      const downloadButton = screen.getByTestId('download-button');
      await user.click(downloadButton);

      expect(consoleSpy).toHaveBeenCalledWith('Download button clicked');
      consoleSpy.mockRestore();
    });
  });

  describe('Data Validation Tests', () => {
    test('passes correct daily summary data to bar chart', () => {
      renderWithRouter(<HomePage user={mockUser} onLogout={mockOnLogout} />);

      const barChartData = screen.getByTestId('bar-chart-data');
      const data = JSON.parse(barChartData.textContent);

      expect(data.categories).toHaveLength(9);
      expect(data.quality).toHaveLength(9);
      expect(data.compliance).toHaveLength(9);
      expect(data.categories[0]).toBe('01/06');
      expect(data.quality[0]).toBe(95);
      expect(data.compliance[0]).toBe(92);
    });

    test('passes correct monthly summary data to line chart', () => {
      renderWithRouter(<HomePage user={mockUser} onLogout={mockOnLogout} />);

      const lineChartData = screen.getByTestId('line-chart-data');
      const data = JSON.parse(lineChartData.textContent);

      expect(data.categories).toHaveLength(12);
      expect(data.quality).toHaveLength(12);
      expect(data.compliance).toHaveLength(12);
      expect(data.categories[0]).toBe('07/2024');
      expect(data.quality[0]).toBe(88);
      expect(data.compliance[0]).toBe(85);
    });

    test('passes correct percentages to doughnut charts', () => {
      renderWithRouter(<HomePage user={mockUser} onLogout={mockOnLogout} />);

      const percentages = screen.getAllByTestId('doughnut-percentage');
      
      expect(percentages[0].textContent).toBe('89.86%');
      expect(percentages[1].textContent).toBe('93.8%');
      expect(percentages[2].textContent).toBe('92.9%');
    });

    test('passes correct colors to doughnut charts', () => {
      renderWithRouter(<HomePage user={mockUser} onLogout={mockOnLogout} />);

      const colors = screen.getAllByTestId('doughnut-color');
      
      colors.forEach(color => {
        expect(color.textContent).toBe('#4ade80');
      });
    });

    test('passes correct labels to doughnut charts', () => {
      renderWithRouter(<HomePage user={mockUser} onLogout={mockOnLogout} />);

      expect(screen.getByText('Monthly Plan Compliance')).toBeInTheDocument();
      expect(screen.getByText('MTD Plant Quality Rating')).toBeInTheDocument();
      expect(screen.getByText('YTD Plant Quality Rating')).toBeInTheDocument();
    });
  });

  describe('Layout and Structure Tests', () => {
    test('has correct CSS class structure', () => {
      const { container } = renderWithRouter(
        <HomePage user={mockUser} onLogout={mockOnLogout} />
      );

      expect(container.querySelector('.homepage-container')).toBeInTheDocument();
      expect(container.querySelector('.homepage-navbar')).toBeInTheDocument();
      expect(container.querySelector('.homepage-content')).toBeInTheDocument();
      expect(container.querySelector('.homepage-first-row')).toBeInTheDocument();
      expect(container.querySelector('.homepage-second-row')).toBeInTheDocument();
    });

    test('navbar has left and right sections', () => {
      const { container } = renderWithRouter(
        <HomePage user={mockUser} onLogout={mockOnLogout} />
      );

      expect(container.querySelector('.homepage-navbar-left')).toBeInTheDocument();
      expect(container.querySelector('.homepage-navbar-right')).toBeInTheDocument();
    });

    test('first row contains all expected cards', () => {
      const { container } = renderWithRouter(
        <HomePage user={mockUser} onLogout={mockOnLogout} />
      );

      const firstRow = container.querySelector('.homepage-first-row');
      
      expect(within(firstRow).getByTestId('bar-chart')).toBeInTheDocument();
      expect(within(firstRow).getAllByTestId('doughnut-chart')).toHaveLength(3);
      expect(within(firstRow).getByTestId('violation-chart')).toBeInTheDocument();
    });

    test('second row contains line chart', () => {
      const { container } = renderWithRouter(
        <HomePage user={mockUser} onLogout={mockOnLogout} />
      );

      const secondRow = container.querySelector('.homepage-second-row');
      expect(within(secondRow).getByTestId('line-chart')).toBeInTheDocument();
    });
  });

  describe('Edge Cases and Error Handling', () => {
    // FIXED: This test was expecting the wrong behavior
    test('handles undefined user gracefully', () => {
      renderWithRouter(<HomePage user={undefined} onLogout={mockOnLogout} />);

      // Should render with default "Unknown" user (the default parameter value)
      expect(screen.getByText('Welcome,')).toBeInTheDocument();
      expect(screen.getByText('Unknown')).toBeInTheDocument();
    });

    test('handles null user gracefully', () => {
      renderWithRouter(<HomePage user={null} onLogout={mockOnLogout} />);

      expect(screen.queryByText('Welcome,')).not.toBeInTheDocument();
    });

    test('handles missing onLogout prop', () => {
      renderWithRouter(<HomePage user={mockUser} />);

      const logoutButton = screen.getByRole('button', { name: /Logout/i });
      expect(logoutButton).toBeInTheDocument();
    });

    test('handles user with empty sapId', () => {
      renderWithRouter(<HomePage user={{ sapId: '' }} onLogout={mockOnLogout} />);

      expect(screen.getByText('Welcome,')).toBeInTheDocument();
    });

    test('handles user with special characters in sapId', () => {
      const specialUser = { sapId: 'TEST@123#456' };
      renderWithRouter(<HomePage user={specialUser} onLogout={mockOnLogout} />);

      expect(screen.getByText('TEST@123#456')).toBeInTheDocument();
    });

    test('handles user with very long sapId', () => {
      const longUser = { sapId: 'A'.repeat(100) };
      renderWithRouter(<HomePage user={longUser} onLogout={mockOnLogout} />);

      expect(screen.getByText('A'.repeat(100))).toBeInTheDocument();
    });
  });

  describe('Component Props Tests', () => {
    test('DashboardHeader receives all required props', () => {
      renderWithRouter(<HomePage user={mockUser} onLogout={mockOnLogout} />);

      const header = screen.getByTestId('dashboard-header');
      expect(header).toBeInTheDocument();
      
      // All buttons from DashboardHeader should be present
      expect(screen.getByTestId('back-button')).toBeInTheDocument();
      expect(screen.getByTestId('month-button')).toBeInTheDocument();
      expect(screen.getByTestId('date-input')).toBeInTheDocument();
      expect(screen.getByTestId('download-button')).toBeInTheDocument();
    });

    test('charts receive required data props', () => {
      renderWithRouter(<HomePage user={mockUser} onLogout={mockOnLogout} />);

      // Bar chart should have data
      expect(screen.getByTestId('bar-chart-data')).toBeInTheDocument();
      
      // Line chart should have data
      expect(screen.getByTestId('line-chart-data')).toBeInTheDocument();
      
      // Doughnut charts should have percentages
      const percentages = screen.getAllByTestId('doughnut-percentage');
      expect(percentages.length).toBeGreaterThan(0);
    });
  });

  describe('Accessibility Tests', () => {
    test('logout button is accessible', () => {
      renderWithRouter(<HomePage user={mockUser} onLogout={mockOnLogout} />);

      const logoutButton = screen.getByRole('button', { name: /Logout/i });
      expect(logoutButton).toBeInTheDocument();
      expect(logoutButton).toHaveClass('homepage-logout-button');
    });

    test('title is present for screen readers', () => {
      renderWithRouter(<HomePage user={mockUser} onLogout={mockOnLogout} />);

      const title = screen.getByText('Project INFINITI - Digital Plant');
      expect(title).toBeInTheDocument();
      expect(title.tagName).toBe('H2');
    });

    test('user information is clearly labeled', () => {
      renderWithRouter(<HomePage user={mockUser} onLogout={mockOnLogout} />);

      const welcomeText = screen.getByText('Welcome,');
      expect(welcomeText).toBeInTheDocument();
      
      const sapId = screen.getByText('TEST12345');
      expect(sapId).toBeInTheDocument();
    });
  });

  describe('Multiple User Scenarios', () => {
    test('renders correctly for different users', () => {
      const users = [
        { sapId: 'USER001' },
        { sapId: 'ADMIN999' },
        { sapId: 'TEST555' }
      ];

      users.forEach(testUser => {
        const { unmount } = renderWithRouter(
          <HomePage user={testUser} onLogout={mockOnLogout} />
        );
        
        expect(screen.getByText(testUser.sapId)).toBeInTheDocument();
        unmount();
      });
    });
  });

  describe('Console Log Tests', () => {
    test('logs correct message on back button click', async () => {
      const consoleSpy = vi.spyOn(console, 'log');
      const user = userEvent.setup();
      
      renderWithRouter(<HomePage user={mockUser} onLogout={mockOnLogout} />);
      
      await user.click(screen.getByTestId('back-button'));
      
      expect(consoleSpy).toHaveBeenCalledWith('Back button clicked');
      consoleSpy.mockRestore();
    });

    test('all handler functions log appropriately', async () => {
      const consoleSpy = vi.spyOn(console, 'log');
      const user = userEvent.setup();
      
      renderWithRouter(<HomePage user={mockUser} onLogout={mockOnLogout} />);
      
      // Test each handler
      await user.click(screen.getByTestId('back-button'));
      await user.click(screen.getByTestId('month-button'));
      await user.click(screen.getByTestId('download-button'));
      
      expect(consoleSpy).toHaveBeenCalledWith('Back button clicked');
      expect(consoleSpy).toHaveBeenCalledWith('This Month button clicked');
      expect(consoleSpy).toHaveBeenCalledWith('Download button clicked');
      
      consoleSpy.mockRestore();
    });
  });
});