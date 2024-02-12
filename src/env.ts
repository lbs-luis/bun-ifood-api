import { z } from 'zod'

const envSchema = z.object({
  API_BASE_URL: z.string().url(),
  AUTH_REDIRECT_URL: z.string().url(),
  DB_URL: z.string().url().min(1),
  JWT_SECRET_KEY: z.string().min(1),
  RESEND_API_KEY: z.string().min(1),
})

// prod
const _env = {
  API_BASE_URL: 'https://api-dashboardwizard.fly.dev',
  AUTH_REDIRECT_URL: 'https://dashboard-wizard.vercel.app',
  DB_URL:
    'postgresql://LBS-luis:Q3PnUiMKYc2X@ep-proud-pond-a5u0kq7s.us-east-2.aws.neon.tech/DashboardWizard?sslmode=require',
  JWT_SECRET_KEY: 'my-super-secret-key',
  RESEND_API_KEY: 're_BqWEj88d_FfWWM4MQwrxdWAYiN2ji2PJM',
}

// dev process.env

export const env = envSchema.parse(_env)
