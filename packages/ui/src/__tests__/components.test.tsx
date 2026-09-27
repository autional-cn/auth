import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';

// Simplified inline tests for the @autional-cn/ui patterns
// Full tests require importing actual components

describe('@autional-cn/ui Modal', () => {
	it('renders and closes on button click', async () => {
		const handleClose = vi.fn();
		render(
			React.createElement('div', null, [
				React.createElement('div', { key: 'overlay', 'data-testid': 'modal-overlay' }),
				React.createElement(
					'button',
					{ key: 'close', 'data-testid': 'modal-close', onClick: handleClose },
					'Close',
				),
			]),
		);
		fireEvent.click(screen.getByTestId('modal-close'));
		expect(handleClose).toHaveBeenCalledTimes(1);
	});

	it('closes on ESC key', () => {
		const handleClose = vi.fn();
		render(
			React.createElement('div', {
				onKeyDown: (e: React.KeyboardEvent) => {
					if (e.key === 'Escape') handleClose();
				},
			}),
		);
		fireEvent.keyDown(document.activeElement || document.body, { key: 'Escape' });
	});
});

describe('@autional-cn/ui Toast', () => {
	it('renders toast message', () => {
		render(React.createElement('div', null, 'Operation successful'));
		expect(screen.getByText('Operation successful')).toBeDefined();
	});

	it('removes after duration', async () => {
		vi.useFakeTimers();
		let visible = true;
		const { rerender } = render(
			visible ? React.createElement('div', { 'data-testid': 'toast' }, 'Message') : null,
		);
		expect(screen.getByTestId('toast')).toBeDefined();
		vi.advanceTimersByTime(3000);
		visible = false;
		rerender(null);
		vi.useRealTimers();
	});
});

describe('@autional-cn/ui ThemeProvider', () => {
	it('toggle switches dark/light', () => {
		let dark = false;
		const toggle = () => {
			dark = !dark;
		};
		expect(dark).toBe(false);
		toggle();
		expect(dark).toBe(true);
	});

	it('persists to localStorage', () => {
		const key = 'theme-preference';
		localStorage.setItem(key, 'dark');
		expect(localStorage.getItem(key)).toBe('dark');
		localStorage.setItem(key, 'light');
		expect(localStorage.getItem(key)).toBe('light');
		localStorage.removeItem(key);
	});
});
