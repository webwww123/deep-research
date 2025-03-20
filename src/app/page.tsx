"use client";
import dynamic from "next/dynamic";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useGlobalStore } from "@/store/global";

const Header = dynamic(() => import("@/components/Header"));
const Setting = dynamic(() => import("@/components/Setting"));
const Topic = dynamic(() => import("@/components/Research/Topic"));
const Feedback = dynamic(() => import("@/components/Research/Feedback"));
const SearchResult = dynamic(
  () => import("@/components/Research/SearchResult")
);
const FinalReport = dynamic(() => import("@/components/Research/FinalReport"));
const FeedbackDialog = dynamic(() => import("@/components/FeedbackDialog"));

function Home() {
  const { t } = useTranslation();
  const { openSetting, setOpenSetting } = useGlobalStore();
  const [openFeedback, setOpenFeedback] = useState(false);

  return (
    <div className="max-w-screen-md mx-auto px-4">
      <Header />
      <main>
        <Topic />
        <Feedback />
        <SearchResult />
        <FinalReport />
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
      </aside>
    </div>
  );
}

export default Home;
