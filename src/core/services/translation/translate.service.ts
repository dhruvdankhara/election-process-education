export const translationService = {
  // Deterministic fallback until cloud translation wiring is available.
  translate: async (text: string, lang: string) => {
    if (lang === "en") return text;
    if (lang === "hi") return `हिंदी: ${text}`;
    if (lang === "gu") return `ગુજરાતી: ${text}`;
    return `[${lang}] ${text}`;
  },
};
