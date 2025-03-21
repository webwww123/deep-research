import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SettingStore {
  apiKey: string;
  apiProxy: string;
  accessPassword: string;
  language: string;
}

interface SettingFunction {
  update: (values: Partial<SettingStore>) => void;
}

export const useSettingStore = create(
  persist<SettingStore & SettingFunction>(
    (set) => ({
      apiKey: "AIzaSyDmJMjNGz3kLfMQBg0wBHISrdC1leM7j10",
      apiProxy: "https://api-proxy.me/gemini",
      accessPassword: "",
      language: "",
      update: (values) => set(values),
    }),
    { name: "setting" }
  )
);
