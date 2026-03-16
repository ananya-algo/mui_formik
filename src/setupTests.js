import React from 'react';
import { expect, afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

expect.extend(matchers);

// Mock MUI icons to reduce file handles from @mui/icons-material
vi.mock('@mui/icons-material', () => {
  const handler = {
    get: (_target, prop) => {
      // Simple stand-in React component for any icon
      // eslint-disable-next-line react/display-name
      return (props) =>
        React.createElement('span', {
          'data-testid': `mui-icon-${String(prop)}`,
          ...props,
        });
    },
  };

  return {
    __esModule: true,
    default: new Proxy({}, handler),
    // Support named imports: { Home, Menu, ... }
    ...new Proxy({}, handler),
  };
});

// Cleanup after each test
afterEach(() => {
  cleanup();
});