"use client";
import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useGlobalStore } from "@/store/global";
import { useBillingStore } from "@/store/billing";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

const Header = dynamic(() => import("@/components/Header"));
const Setting = dynamic(() => import("@/components/Setting"));
const Topic = dynamic(() => import("@/components/Research/Topic"));
const Feedback = dynamic(() => import("@/components/Research/Feedback"));
const SearchResult = dynamic(
  () => import("@/components/Research/SearchResult")
);
const FinalReport = dynamic(() => import("@/components/Research/FinalReport"));
const FeedbackDialog = dynamic(() => import("@/components/FeedbackDialog"));
const ModelSelector = dynamic(() => import("@/components/ModelSelector"));
const BillingDisplay = dynamic(() => import("@/components/BillingDisplay"));
const TotalBilling = dynamic(() => import("@/components/TotalBilling"));

function Home() {
  const { t } = useTranslation();
  const { openSetting, setOpenSetting } = useGlobalStore();
  const [openFeedback, setOpenFeedback] = useState(false);
  const [openModelSelector, setOpenModelSelector] = useState(true);
  const { setModel, setUsername, setShowBilling, resetUsage } = useBillingStore();
  const router = useRouter();
  const { status } = useSession();
  
  // 活跃状态追踪 - 将hooks提前声明，避免条件渲染错误
  const [activeStep, setActiveStep] = useState<string | null>(null);

  // 检查用户登录状态
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);
  
  // 当组件挂载时重置计费
  useEffect(() => {
    resetUsage();
  }, [resetUsage]);

  // 处理模型选择
  const handleModelSelect = (selectedModel?: string, username?: string) => {
    if (selectedModel) {
      setModel(selectedModel);
    }
    if (username) {
      setUsername(username);
    }
    setOpenModelSelector(false);
    setShowBilling(true);
  };
  
  // 如果正在检查登录状态，显示加载中
  if (status === "loading") {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="text-xl">加载中...</div>
    </div>;
  }
  
  // 如果未登录，不渲染内容
  if (status === "unauthenticated") {
    return null;
  }

  return (
    <div className="max-w-screen-md mx-auto px-4">
      <Header />
      <main>
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">1. 研究方向</h2>
            <BillingDisplay step="thinking" active={activeStep === "thinking"} />
          </div>
          <Topic setActiveStep={setActiveStep} />
        </div>
        
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">2. 提出您的想法</h2>
            <BillingDisplay step="research" active={activeStep === "research"} />
          </div>
          <Feedback setActiveStep={setActiveStep} />
        </div>
        
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">3. 信息搜集</h2>
            <BillingDisplay step="searchResult" active={activeStep === "searchResult"} />
          </div>
          <SearchResult setActiveStep={setActiveStep} />
        </div>
        
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">4. 最终报告</h2>
            <BillingDisplay step="finalReport" active={activeStep === "finalReport"} />
          </div>
          <FinalReport setActiveStep={setActiveStep} />
        </div>
        
        <TotalBilling />
      </main>
      <footer className="my-4 text-center text-sm text-gray-600">
        <span>
          {t("copyright", {
            name: "",
          }).replace("❤️", "")}
          <span 
            className="text-red-500 cursor-pointer hover:text-red-600 inline-block transform hover:scale-110 transition-all"
            onClick={() => setOpenFeedback(true)}
          >
            ❤️
          </span>
        </span>
      </footer>
      <aside>
        <Setting open={openSetting} onClose={() => setOpenSetting(false)} />
        <FeedbackDialog open={openFeedback} onClose={() => setOpenFeedback(false)} />
        <ModelSelector open={openModelSelector} onClose={handleModelSelect} />
      </aside>
    </div>
  );
}

export default Home;
