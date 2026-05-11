import { z } from 'zod';

const EnvSchema = z.object({
    MONGO_URI: z.string(),
    RESEND_KEY: z.string(),
});

export type EnvSchema = z.infer<typeof EnvSchema>;

export default EnvSchema.parse(process.env);