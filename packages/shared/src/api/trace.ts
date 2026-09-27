const traceparentProviders: Array<() => string | undefined> = [];

export function setTraceParentProvider(provider: () => string | undefined): void {
	traceparentProviders.push(provider);
}

export function getTraceParentHeader(): string | undefined {
	for (const provider of traceparentProviders) {
		const tp = provider();
		if (tp) return tp;
	}
	return undefined;
}

export function resetSessionTraceId(): void {
	// trace ID is managed by the OTel bridge
}

export function enableOtelBridge(): void {
	// No-op stub — requires @opentelemetry/api dependency
}
