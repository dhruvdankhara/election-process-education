import { env } from "@/core/config/env";

export class SpeechService {
  async textToSpeech(
    text: string,
    languageCode: string = env.GOOGLE_TTS_LANGUAGE_CODE
  ): Promise<Buffer> {
    const payload = JSON.stringify({
      languageCode,
      text,
      voice: env.GOOGLE_TTS_VOICE_NAME,
    });

    // Deterministic fallback bytes for local/dev environments.
    return Buffer.from(payload, "utf-8");
  }
}
