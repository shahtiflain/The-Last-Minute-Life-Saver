import { render } from '@testing-library/react';
import { expect, test, vi } from 'vitest';
import App from './App';

// Mock matchMedia for jsdom
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock firebase
vi.mock('./config/firebase', () => ({
  auth: {
    currentUser: null,
    onAuthStateChanged: vi.fn(),
  },
  initializeApp: vi.fn(),
  getAuth: vi.fn(),
}));

test('renders App without crashing', () => {
  render(<App />);
  // Should show loading or redirect to login (which shows the login title)
  expect(document.body).toBeDefined();
});
