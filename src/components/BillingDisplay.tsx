"use client";
import { useEffect, useRef } from "react";
import { useBillingStore } from "@/store/billing";

type BillingDisplayProps = {
  step: keyof ReturnType<typeof useBillingStore.getState>["tokenUsage"];
  active?: boolean;
};

function BillingDisplay({ step, active = false }: BillingDisplayProps) {
  const { tokenUsage, selectedModel } = useBillingStore();
  const usage = tokenUsage[step];
  const prevUsageRef = useRef({ input: 0, output: 0, cost: 0 });
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // 当活跃时，自动增加使用量
  useEffect(() => {
    if (active) {
      const incrementAmount = {
        thinking: { input: 50, output: 100 },
        research: { input: 200, output: 300 },
        searchResult: { input: 500, output: 700 },
        finalReport: { input: 800, output: 1200 }
      };

      const increment = incrementAmount[step];
      const randomizeIncrement = () => ({
        input: Math.floor(increment.input * (0.8 + Math.random() * 0.4)),
        output: Math.floor(increment.output * (0.8 + Math.random() * 0.4))
      });

      // 每秒更新一次
      timerRef.current = setInterval(() => {
        const { input, output } = randomizeIncrement();
        const newInput = prevUsageRef.current.input + input;
        const newOutput = prevUsageRef.current.output + output;
        
        // 更新UI和存储的值
        useBillingStore.getState().updateTokenUsage(step, newInput, newOutput);
        prevUsageRef.current = { 
          input: newInput, 
          output: newOutput, 
          cost: usage.cost 
        };
      }, 1000);

      return () => {
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
      };
    }
  }, [active, step]);

  // 格式化成本为美元
  const formatCost = (cost: number) => {
    return `$${cost.toFixed(6)}`;
  };

  // 格式化tokens数量
  const formatTokens = (tokens: number) => {
    return tokens.toLocaleString();
  };

  if (usage.input === 0 && usage.output === 0 && !active) {
    return null;
  }

  return (
    <div className="flex items-center text-xs text-gray-500 mt-1 space-x-2">
      <span className="flex items-center">
        <span className="mr-1">输入:</span>
        <span className="font-mono">{formatTokens(usage.input)}</span>
      </span>
      <span className="flex items-center">
        <span className="mr-1">输出:</span>
        <span className="font-mono">{formatTokens(usage.output)}</span>
      </span>
      <span className="flex items-center font-medium text-green-600">
        <span className="mr-1">费用:</span>
        <span className="font-mono">{formatCost(usage.cost)}</span>
      </span>
    </div>
  );
}

export default BillingDisplay; 