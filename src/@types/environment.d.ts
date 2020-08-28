declare namespace NodeJS {
	// eslint-disable-next-line @typescript-eslint/naming-convention
	export interface ProcessEnv {
		APP_SECRET: string;
		APP_API_URL: string;
		APP_WEB_URL: string;
		AWS_ACCESS_KEY_ID: string;
		AWS_SECRET_ACCESS_KEY: string;
		AWS_DEFAULT_REGION: string;
		MAIL_DRIVER: 'ethereal' | 'ses';
		STORAGE_DRIVER: 'disk' | 's3';
		CACHE_DRIVER: 'redis';
	}
}
