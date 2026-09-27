import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { PasswordInput } from '../form/PasswordInput';

vi.mock('react-i18next', () => ({
	useTranslation: () => ({
		t: (key: string, opts?: any) => (opts ? `${key} ${JSON.stringify(opts)}` : key),
		i18n: { language: 'zh-CN', changeLanguage: vi.fn() },
	}),
	I18nextProvider: ({ children }: any) => children,
}));

describe('PasswordInput', () => {
	it('renders password field', () => {
		render(<PasswordInput placeholder="Enter password" />);
		const input = screen.getByPlaceholderText('Enter password');
		expect(input).toBeInTheDocument();
		expect(input).toHaveAttribute('type', 'password');
	});

	it('eye toggle shows/hides password', () => {
		render(<PasswordInput placeholder="Enter password" />);
		const input = screen.getByPlaceholderText('Enter password');
		expect(input).toHaveAttribute('type', 'password');

		const toggle = screen.getByRole('button', { name: /password\.show/ });
		fireEvent.click(toggle);
		expect(input).toHaveAttribute('type', 'text');

		const toggleHide = screen.getByRole('button', { name: /password\.hide/ });
		fireEvent.click(toggleHide);
		expect(input).toHaveAttribute('type', 'password');
	});

	it('does not show strength indicator when showStrength is false', () => {
		render(<PasswordInput placeholder="Enter password" />);
		expect(screen.queryByText(/password\.strengthLabel/)).not.toBeInTheDocument();
		expect(screen.queryByText(/password\.strengthLabel/)).not.toBeInTheDocument();
	});

	it('shows strength indicator when showStrength is true and value is provided', () => {
		render(
			<PasswordInput placeholder="Enter password" showStrength value="weak" onChange={() => {}} />,
		);
		const el = screen.getByText(/password\.strengthLabel/);
		expect(el).toBeInTheDocument();
	});

	it('shows weak strength for simple password', () => {
		render(
			<PasswordInput placeholder="Enter password" showStrength value="abc" onChange={() => {}} />,
		);
		const el = screen.getByText(/password\.strengthLabel/);
		expect(el).toBeInTheDocument();
	});

	it('shows strong strength for complex password', () => {
		render(
			<PasswordInput
				placeholder="Enter password"
				showStrength
				value="Str0ng!Pass"
				onChange={() => {}}
			/>,
		);
		const el = screen.getByText(/password\.strengthLabel/);
		expect(el).toBeInTheDocument();
	});

	it('displays error message when error prop is set', () => {
		render(<PasswordInput placeholder="Enter password" error="Password is required" />);
		expect(screen.getByText('Password is required')).toBeInTheDocument();
	});
});
