"use client";
import { useEffect, useRef } from "react";
import { useBillingStore } from "@/store/billing";

type BillingDisplayProps = {
  step: keyof ReturnType<typeof useBillingStore.getState>["tokenUsage"];
  active?: boolean;
};

function BillingDisplay({ step, active = false }: BillingDisplayProps) {
  const { tokenUsage } = useBillingStore();
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, step, usage.cost]);

  // 格式化成本为美元
  const formatCost = (cost: number) => {
    return `$${cost.toFixed(6)}`;
  };

  // 格式化tokens数量
  const formatTokens = (tokens: number) => {
    return tokens.toLocaleString();
  };

  // 计算总token数量
  const totalTokens = usage.input + usage.output;

  if (totalTokens === 0 && !active) {
    return null;
  }

  return (
    <div className="flex items-center text-sm font-medium mt-1 ml-2 space-x-3">
      <span className="flex items-center bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-md">
        <span className="mr-1 text-black dark:text-white">Token用量:</span>
        <span className="font-mono text-blue-600 dark:text-blue-400">{formatTokens(totalTokens)}</span>
      </span>
      <span className="flex items-center bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-md">
        <span className="mr-1 text-black dark:text-white">费用:</span>
        <span className="font-mono text-green-600 dark:text-green-400 font-bold">{formatCost(usage.cost)}</span>
      </span>
    </div>
  );
}

export default BillingDisplay; 