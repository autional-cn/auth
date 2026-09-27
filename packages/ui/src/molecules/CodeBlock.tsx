import React, { useState, useCallback } from 'react';
import { Check, Copy } from 'lucide-react';

interface CodeBlockProps {
	code: string;
	language?: string;
	filename?: string;
	className?: string;
}

export const CodeBlock = React.memo(function CodeBlock({
	code,
	language = 'bash',
	filename,
	className = '',
}: CodeBlockProps) {
	const [copied, setCopied] = useState(false);

	const handleCopy = useCallback(() => {
		navigator.clipboard.writeText(code).then(() => {
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		});
	}, [code]);

	return (
		<div
			className={`overflow-hidden rounded-lg border border-neutral-200 bg-neutral-900 dark:border-neutral-800 ${className}`}
		>
			{(filename || language) && (
				<div className="flex items-center justify-between border-b border-neutral-800 bg-neutral-950 px-4 py-2">
					<div className="flex items-center gap-2">
						{filename && <span className="text-xs text-neutral-400">{filename}</span>}
						{!filename && <span className="text-xs uppercase text-neutral-500">{language}</span>}
					</div>
					<button
						onClick={handleCopy}
						className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs text-neutral-400 transition-colors hover:bg-neutral-800 hover:text-neutral-200"
						aria-label="复制代码"
					>
						{copied ? (
							<Check className="h-3.5 w-3.5 text-success" />
						) : (
							<Copy className="h-3.5 w-3.5" />
						)}
						{copied ? '已复制' : '复制'}
					</button>
				</div>
			)}
			<pre className="overflow-x-auto p-4 text-sm leading-relaxed">
				<code className="font-mono text-neutral-200">{code}</code>
			</pre>
		</div>
	);
});
