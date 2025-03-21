import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { useSettingStore } from "@/store/setting";

// 硬编码API密钥和代理URL
const DEFAULT_API_KEY = "AIzaSyDmJMjNGz3kLfMQBg0wBHISrdC1leM7j10";
const DEFAULT_API_PROXY = "https://ghl-gemini.deno.dev";

export function useGoogleProvider() {
  const { apiKey, apiProxy } = useSettingStore();

  // 优先使用用户设置的API密钥和代理(如果有)
  // 但是默认值改为硬编码的值，这样所有人都能使用
  return createGoogleGenerativeAI(
    apiKey
      ? {
          baseURL: `${
            apiProxy || DEFAULT_API_PROXY
          }/v1beta`,
          apiKey,
        }
      : {
          // 无API密钥时使用硬编码的代理和密钥
          baseURL: "/api/ai/google/v1beta",
          apiKey: DEFAULT_API_KEY,
        }
  );
}
