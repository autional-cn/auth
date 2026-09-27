import {
	createContext,
	useContext,
	useState,
	useCallback,
	useRef,
	useEffect,
	type ReactNode,
} from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastItem {
	id: string;
	message: string;
	type: ToastType;
}

interface ToastContextValue {
	addToast: (message: string, type?: ToastType, duration?: number) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast(): ToastContextValue {
	const ctx = useContext(ToastContext);
	if (!ctx) throw new Error('useToast must be used within <ToastProvider>');
	return ctx;
}

let globalShow: ((message: string, type?: ToastType, duration?: number) => void) | null = null;

export function showToast(message: string, type: ToastType = 'info', duration?: number) {
	globalShow?.(message, type, duration);
}

const ICONS: Record<ToastType, typeof CheckCircle> = {
	success: CheckCircle,
	error: AlertCircle,
	warning: AlertTriangle,
	info: Info,
};

const STYLES: Record<ToastType, string> = {
	success: 'bg-success text-white',
	error: 'bg-danger text-white',
	warning: 'bg-amber-500 text-white',
	info: 'bg-[var(--color-brand)] text-white',
};

export function ToastProvider({ children }: { children: ReactNode }) {
	const [toasts, setToasts] = useState<ToastItem[]>([]);
	const timers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

	const removeToast = useCallback((id: string) => {
		setToasts((prev) => prev.filter((t) => t.id !== id));
		if (timers.current[id]) {
			clearTimeout(timers.current[id]);
			delete timers.current[id];
		}
	}, []);

	const addToast = useCallback(
		(message: string, type: ToastType = 'info', duration = 3000) => {
			const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
			setToasts((prev) => [...prev, { id, message, type }]);
			timers.current[id] = setTimeout(() => removeToast(id), duration);
		},
		[removeToast],
	);

	globalShow = addToast;

	useEffect(() => {
		return () => {
			Object.values(timers.current).forEach(clearTimeout);
		};
	}, []);

	return (
		<ToastContext.Provider value={{ addToast }}>
			{children}
			<div className="pointer-events-none fixed right-4 top-4 z-[100] flex flex-col gap-2">
				{toasts.map((toast) => {
					const Icon = ICONS[toast.type];
					return (
						<div
							key={toast.id}
							className={`pointer-events-auto flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium shadow-lg ${STYLES[toast.type]}`}
						>
							<Icon className="h-4 w-4 shrink-0" />
							<span className="flex-1">{toast.message}</span>
							<button
								onClick={() => removeToast(toast.id)}
								className="ml-1 shrink-0 rounded p-0.5 opacity-70 hover:bg-white/20 hover:opacity-100"
							>
								<X className="h-3.5 w-3.5" />
							</button>
						</div>
					);
				})}
			</div>
		</ToastContext.Provider>
	);
}
