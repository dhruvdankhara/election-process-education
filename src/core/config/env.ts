import { z } from "zod";

const emptyStringToUndefined = (value: unknown) => {
  if (typeof value === "string" && value.trim().length === 0) {
    return undefined;
  }
  return value;
};

const optionalString = z.preprocess(emptyStringToUndefined, z.string().min(1).optional());

const optionalBoolean = z.preprocess((value) => {
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    if (!normalized) {
      return undefined;
    }

    if (["true", "1", "yes", "on"].includes(normalized)) {
      return true;
    }

    if (["false", "0", "no", "off"].includes(normalized)) {
      return false;
    }
  }

  return value;
}, z.boolean().optional());

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  GOOGLE_CLOUD_PROJECT_ID: optionalString,
  GOOGLE_CLOUD_PROJECT: optionalString,
  GOOGLE_API_KEY: optionalString,
  GEMINI_API_KEY: optionalString,
  FIRESTORE_PROJECT_ID: optionalString,
  FIRESTORE_DATABASE_ID: optionalString,
  NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: optionalString,
  AUTH_JWT_SECRET: z.string().min(1),
  AUTH_COOKIE_NAME: optionalString,
  GOOGLE_OAUTH_CLIENT_ID: z.string().min(1),
  GOOGLE_OAUTH_CLIENT_SECRET: z.string().min(1),
  GOOGLE_OAUTH_CALLBACK_URL: z.preprocess(emptyStringToUndefined, z.string().url().optional()),
  GOOGLE_ANALYTICS_PROPERTY_ID: optionalString,
  GOOGLE_GENAI_USE_VERTEXAI: optionalBoolean,
  GOOGLE_CLOUD_LOCATION: optionalString,
  GOOGLE_VERTEX_MODEL: z.string().default("gemini-2.5-flash"),
  GOOGLE_TTS_LANGUAGE_CODE: z.string().default("en-IN"),
  GOOGLE_TTS_VOICE_NAME: z.string().default("en-IN-Standard-B"),
  GOOGLE_APPLICATION_CREDENTIALS: optionalString,
  ADMIN_EMAIL_ALLOWLIST: optionalString,
});

// To provide meaningful error messages during local development if things are missing
const parsedEnv = envSchema.safeParse({
  NODE_ENV: process.env.NODE_ENV,
  GOOGLE_CLOUD_PROJECT_ID: process.env.GOOGLE_CLOUD_PROJECT_ID,
  GOOGLE_CLOUD_PROJECT: process.env.GOOGLE_CLOUD_PROJECT,
  GOOGLE_API_KEY: process.env.GOOGLE_API_KEY,
  GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  FIRESTORE_PROJECT_ID: process.env.FIRESTORE_PROJECT_ID,
  FIRESTORE_DATABASE_ID: process.env.FIRESTORE_DATABASE_ID,
  NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  AUTH_JWT_SECRET: process.env.AUTH_JWT_SECRET,
  AUTH_COOKIE_NAME: process.env.AUTH_COOKIE_NAME,
  GOOGLE_OAUTH_CLIENT_ID: process.env.GOOGLE_OAUTH_CLIENT_ID,
  GOOGLE_OAUTH_CLIENT_SECRET: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
  GOOGLE_OAUTH_CALLBACK_URL: process.env.GOOGLE_OAUTH_CALLBACK_URL,
  GOOGLE_ANALYTICS_PROPERTY_ID: process.env.GOOGLE_ANALYTICS_PROPERTY_ID,
  GOOGLE_GENAI_USE_VERTEXAI: process.env.GOOGLE_GENAI_USE_VERTEXAI,
  GOOGLE_CLOUD_LOCATION: process.env.GOOGLE_CLOUD_LOCATION,
  GOOGLE_VERTEX_MODEL: process.env.GOOGLE_VERTEX_MODEL,
  GOOGLE_TTS_LANGUAGE_CODE: process.env.GOOGLE_TTS_LANGUAGE_CODE,
  GOOGLE_TTS_VOICE_NAME: process.env.GOOGLE_TTS_VOICE_NAME,
  GOOGLE_APPLICATION_CREDENTIALS: process.env.GOOGLE_APPLICATION_CREDENTIALS,
  ADMIN_EMAIL_ALLOWLIST: process.env.ADMIN_EMAIL_ALLOWLIST,
});

if (!parsedEnv.success) {
  console.error("❌ Invalid environment variables:", parsedEnv.error.flatten().fieldErrors);
  // We don't throw an error here to allow the build to proceed if variables are injected later,
  // but it will fail at runtime when accessed if they are missing.
}

export const env = parsedEnv.success ? parsedEnv.data : ({} as z.infer<typeof envSchema>);
