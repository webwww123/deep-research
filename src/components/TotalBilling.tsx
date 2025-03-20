"use client";
import { useBillingStore } from "@/store/billing";

function TotalBilling() {
  const { totalUsage, username, selectedModel, showBilling } = useBillingStore();
  
  if (!showBilling) {
    return null;
  }

  // 获取模型名称
  const getModelName = (modelId: string) => {
    const modelNames: Record<string, string> = {
      "gpt45": "GPT-4.5",
      "claude37sonnet": "Claude 3.7 Sonnet",
      "claude37max": "Claude 3.7 Max",
      "claude35sonnet": "Claude 3.5 Sonnet",
      "gpt4o": "GPT-4o"
    };
    return modelNames[modelId] || modelId;
  };

  // 格式化成本为美元
  const formatCost = (cost: number) => {
    return `$${cost.toFixed(6)}`;
  };

  // 格式化tokens数量
  const formatTokens = (tokens: number) => {
    return tokens.toLocaleString();
  };

  // 计算总token数量
  const totalTokens = totalUsage.input + totalUsage.output;

  return (
    <div className="mt-8 border-t pt-4">
      <h3 className="text-lg font-bold mb-3">会话使用统计</h3>
      
      <div className="bg-gray-50 dark:bg-gray-900 p-5 rounded-lg shadow-sm">
        <div className="flex justify-between mb-3">
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">用户:</span>
          <span className="font-medium">{username}</span>
        </div>
        
        <div className="flex justify-between mb-3">
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">模型:</span>
          <span className="font-medium">{getModelName(selectedModel)}</span>
        </div>
        
        <div className="flex justify-between mb-4 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-md">
          <span className="text-sm font-medium text-blue-800 dark:text-blue-300">总Token用量:</span>
          <span className="font-bold text-blue-700 dark:text-blue-300">{formatTokens(totalTokens)}</span>
        </div>
        
        <div className="flex justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-md border-t border-green-100 dark:border-green-800">
          <span className="font-bold text-green-800 dark:text-green-300">总费用:</span>
          <span className="font-bold text-green-700 dark:text-green-300 text-lg">{formatCost(totalUsage.cost)}</span>
        </div>
      </div>
    </div>
  );
}

export default TotalBilling; 