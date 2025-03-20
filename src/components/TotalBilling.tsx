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
      <h3 className="text-lg font-medium mb-2">使用统计</h3>
      
      <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
        <div className="flex justify-between mb-2">
          <span className="text-sm text-muted-foreground">用户:</span>
          <span className="font-medium">{username}</span>
        </div>
        
        <div className="flex justify-between mb-2">
          <span className="text-sm text-muted-foreground">模型:</span>
          <span className="font-medium">{getModelName(selectedModel)}</span>
        </div>
        
        <div className="flex justify-between mb-2">
          <span className="text-sm text-muted-foreground">总Token用量:</span>
          <span className="font-medium">{formatTokens(totalTokens)}</span>
        </div>
        
        <div className="flex justify-between text-green-600 font-semibold border-t border-gray-200 dark:border-gray-700 pt-2 mt-2">
          <span>总费用:</span>
          <span>{formatCost(totalUsage.cost)}</span>
        </div>
      </div>
    </div>
  );
}

export default TotalBilling; 