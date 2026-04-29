import { create } from "zustand";

interface UiState {
  language: string;
  setLanguage: (language: string) => void;
  voiceEnabled: boolean;
  setVoiceEnabled: (enabled: boolean) => void;
  isSimulating: boolean;
  setSimulation: (active: boolean) => void;
}

export const useUiStore = create<UiState>((set) => ({
  language: "en",
  setLanguage: (language) => set({ language }),
  voiceEnabled: false,
  setVoiceEnabled: (voiceEnabled) => set({ voiceEnabled }),
  isSimulating: false,
  setSimulation: (isSimulating) => set({ isSimulating }),
}));
