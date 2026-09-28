/**
 * 权威版 ErrorBoundary —— 由 pnpm sync:consumers 下发到各站点的 packages/ui/src/molecules/。
 *
 * 为什么放在设计系统仓库里：
 *   packages/ui 是共享组件库，却在 9 个站点各存一份。逐文件比对（2026-09）后 29 个文件里
 *   只有这一个真正不同，而且差异只在界面默认文案上：
 *     7 个站点用英文（Something went wrong / An unexpected error occurred… / Reload Page）
 *     admin 用「出现错误 / 发生意外错误，请刷新页面重试。/ 重新加载页面」
 *     platform 用「页面出错了 / 发生了未知错误，请刷新页面重试。/ 刷新页面」
 *   三份都是 97 行、导出与逻辑完全相同。同一个错误组件在不同 portal 显示不同措辞，
 *   这是文案不统一而非实现分叉（ui 仓库 KI-013）。
 *
 * 语言判定为什么不用 react-i18next：
 *   packages/ui 里 LanguageSwitcher 确实用了 useTranslation，但各 portal 的 t() 约定并不统一——
 *   例如 auth 的 useI18n 走的是 t('flat.' + key)（前缀 flat.），而那个 wrapper 位于
 *   各 portal 的 apps 目录下（apps slash 站点名 slash src slash lib），不在 packages/ui 内，
 *   组件够不着；键前缀约定也不一致。
 *   所以这里改用**各 portal 已经在维护的零依赖信号**：document.documentElement.lang。
 *   各 portal 的 I18nProvider 都在 languageChanged 时调用 syncHtmlLang 同步它。
 *   代价：语言切换时错误页不会实时重渲染（错误边界本就只在出错时渲染一次，可接受）。
 *   若将来统一了跨 portal 的键约定，应改为走 i18n，而不是继续在组件里放文案。
 *
 * 对外 API 不变：<ErrorBoundary>{children}</ErrorBoundary>，仍可传 title / message / retryLabel
 * 覆盖默认文案（props 优先于内置字典）。
 */
import { Component, type ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';

interface ErrorBoundaryProps {
	children: ReactNode;
	fallback?: ReactNode;
	title?: string;
	message?: string;
	retryLabel?: string;
	devMode?: boolean;
}

interface ErrorBoundaryState {
	hasError: boolean;
	error?: Error;
}

const TEXT = {
	zh: {
		devTitle: '开发模式错误边界',
		unknown: '未知错误',
		title: '页面出错了',
		message: '发生了未知错误，请刷新页面重试。',
		retry: '刷新页面',
		reload: '刷新',
	},
	en: {
		devTitle: 'Dev Error Boundary',
		unknown: 'Unknown error',
		title: 'Something went wrong',
		message: 'An unexpected error occurred. Please try refreshing the page.',
		retry: 'Reload Page',
		reload: 'Reload',
	},
};

/** 各 portal 由 I18nProvider 同步 <html lang>（zh-CN / en-US），以此判定文案语言。 */
function text(): typeof TEXT.zh {
	if (typeof document === 'undefined') return TEXT.zh;
	const lang = (document.documentElement.getAttribute('lang') || '').toLowerCase();
	return lang.startsWith('zh') ? TEXT.zh : TEXT.en;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
	constructor(props: ErrorBoundaryProps) {
		super(props);
		this.state = { hasError: false };
	}

	static getDerivedStateFromError(error: Error): ErrorBoundaryState {
		return { hasError: true, error };
	}

	componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
		if (this.props.devMode) {
			console.error('[ErrorBoundary] caught:', error, errorInfo);
		}
	}

	render() {
		const { children, fallback, title, message, retryLabel, devMode } = this.props;
		const T = text();

		if (this.state.hasError) {
			if (fallback) return fallback;

			if (devMode) {
				return (
					<div className="flex min-h-[50vh] flex-col items-center justify-center p-8 text-center" role="alert">
						<div className="flex h-16 w-16 items-center justify-center rounded-full bg-rose-50">
							<AlertTriangle size={32} className="text-rose-600" />
						</div>
						<h2 className="mt-4 text-lg font-semibold text-neutral-900 dark:text-neutral-100">{T.devTitle}</h2>
						<p className="mt-2 max-w-lg text-sm text-neutral-500 dark:text-neutral-400">
							{this.state.error?.message || T.unknown}
						</p>
						{this.state.error?.stack && (
							<pre className="mt-4 max-h-60 max-w-2xl overflow-auto rounded bg-neutral-100 p-3 text-left text-xs text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400">
								{this.state.error.stack}
							</pre>
						)}
						<button
							onClick={() => window.location.reload()}
							className="mt-6 rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 transition-colors"
						>
							{T.reload}
						</button>
					</div>
				);
			}

			return (
				<div className="flex min-h-[50vh] flex-col items-center justify-center p-8 text-center" role="alert">
					<div className="flex h-16 w-16 items-center justify-center rounded-full bg-rose-50 dark:bg-rose-900/20">
						<AlertTriangle size={32} className="text-rose-600" />
					</div>
					<h2 className="mt-4 text-lg font-semibold text-neutral-900 dark:text-neutral-100">{title || T.title}</h2>
					<p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">{message || T.message}</p>
					<button
						onClick={() => window.location.reload()}
						className="mt-6 rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 transition-colors"
					>
						{retryLabel || T.retry}
					</button>
				</div>
			);
		}

		return children;
	}
}
