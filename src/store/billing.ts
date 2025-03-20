import { create } from "zustand";

interface ModelPricing {
  inputPrice: number;
  outputPrice: number;
}

const modelPricing: Record<string, ModelPricing> = {
  "gpt45": { inputPrice: 75, outputPrice: 150 },
  "claude37sonnet": { inputPrice: 3, outputPrice: 15 },
  "claude37max": { inputPrice: 15, outputPrice: 75 },
  "claude35sonnet": { inputPrice: 3, outputPrice: 15 },
  "gpt4o": { inputPrice: 2.5, outputPrice: 10 }
};

interface BillingStore {
  // 当前选择的模型ID
  selectedModel: string;
  // 用户名
  username: string;
  // 各步骤的token使用情况
  tokenUsage: {
    thinking: { input: number; output: number; cost: number };
    research: { input: number; output: number; cost: number };
    searchResult: { input: number; output: number; cost: number };
    finalReport: { input: number; output: number; cost: number };
  };
  // 总使用量
  totalUsage: { input: number; output: number; cost: number };
  // 是否显示计费信息
  showBilling: boolean;

  // 操作函数
  setModel: (modelId: string) => void;
  setUsername: (name: string) => void;
  updateTokenUsage: (
    step: keyof BillingStore["tokenUsage"],
    input: number,
    output: number
  ) => void;
  resetUsage: () => void;
  setShowBilling: (show: boolean) => void;
}

export const useBillingStore = create<BillingStore>((set) => ({
  selectedModel: "claude37sonnet",
  username: "测试用户",
  tokenUsage: {
    thinking: { input: 0, output: 0, cost: 0 },
    research: { input: 0, output: 0, cost: 0 },
    searchResult: { input: 0, output: 0, cost: 0 },
    finalReport: { input: 0, output: 0, cost: 0 }
  },
  totalUsage: { input: 0, output: 0, cost: 0 },
  showBilling: false,

  setModel: (modelId) => set({ selectedModel: modelId }),
  
  setUsername: (name) => set({ username: name }),
  
  updateTokenUsage: (step, input, output) => 
    set((state) => {
      const pricing = modelPricing[state.selectedModel];
      const cost = (input * pricing.inputPrice + output * pricing.outputPrice) / 1000000;
      
      const newTokenUsage = {
        ...state.tokenUsage,
        [step]: { 
          input, 
          output, 
          cost 
        }
      };
      
      // 计算总量
      const totalInput = Object.values(newTokenUsage).reduce((sum, curr) => sum + curr.input, 0);
      const totalOutput = Object.values(newTokenUsage).reduce((sum, curr) => sum + curr.output, 0);
      const totalCost = Object.values(newTokenUsage).reduce((sum, curr) => sum + curr.cost, 0);
      
      return {
        tokenUsage: newTokenUsage,
        totalUsage: { input: totalInput, output: totalOutput, cost: totalCost }
      };
    }),
  
  resetUsage: () => set({
    tokenUsage: {
      thinking: { input: 0, output: 0, cost: 0 },
      research: { input: 0, output: 0, cost: 0 },
      searchResult: { input: 0, output: 0, cost: 0 },
      finalReport: { input: 0, output: 0, cost: 0 }
    },
    totalUsage: { input: 0, output: 0, cost: 0 }
  }),
  
  setShowBilling: (show) => set({ showBilling: show })
})); 