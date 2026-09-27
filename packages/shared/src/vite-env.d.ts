/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly PROD: boolean;
	readonly DEV: boolean;
	readonly MODE: string;
	readonly BASE_URL: string;
	readonly SSR: boolean;
	readonly VITE_OAUTH_CLIENT_ID: string;
	readonly VITE_AUTH_PAGES_URL: string;
	readonly VITE_API_BASE_URL: string;
	readonly VITE_AUDIT_BASE_URL: string;
	[key: string]: string | boolean | undefined;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
