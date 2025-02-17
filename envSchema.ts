import z from 'zod';

const envSchema = z.object({
    // Authentication (Kinde)
    KINDE_CLIENT_ID: z.string().min(1, 'Kinde Client ID is required'),
    KINDE_CLIENT_SECRET: z.string().min(1, 'Kinde Client Secret is required'),
    KINDE_ISSUER_URL: z.string().url('Invalid Kinde Issuer URL format'),
    KINDE_SITE_URL: z.string().url('Invalid Kinde Site URL format'),
    KINDE_POST_LOGOUT_REDIRECT_URL: z.string().url('Invalid logout redirect URL format'),
    KINDE_POST_LOGIN_REDIRECT_URL: z.string().url('Invalid login redirect URL format'),

    // Database
    NEON_POSTGRES_DATABASE_URL: z.string().min(1, 'Database URL is required')
});

const env = envSchema.parse(process.env)

export default env