interface ProcessEnv {
    [key: string]: string | undefined;
    NODE_ENV: 'production' | 'development';
}

export interface Env extends ProcessEnv {
    POCKETBASE_URL: string;
    POCKETBASE_ADMIN_EMAIL: string;
    POCKETBASE_ADMIN_PASSWORD: string;
    POCKETBASE_ADMIN_TOKEN: string;
    TEXTBELT_API_KEY: string;
    ENCRYPTION_KEY: string;
    ENCRYPTION_IV: string;
}
