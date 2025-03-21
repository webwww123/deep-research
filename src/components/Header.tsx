"use client";
import dynamic from "next/dynamic";
import { useTranslation } from "react-i18next";
import { Settings, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGlobalStore } from "@/store/global";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

const ThemeToggle = dynamic(() => import("@/components/Theme/ToggleButton"));

const VERSION = process.env.NEXT_PUBLIC_VERSION;

function Header() {
  const { t } = useTranslation();
  const { setOpenSetting } = useGlobalStore();
  const { data: session } = useSession();

  return (
    <>
      <header className="flex justify-between items-center my-6">
        <h1 className="text-center text-2xl font-bold">
          {t("title")}
          <small className="ml-2 font-normal text-base">v{VERSION}</small>
        </h1>
        <div className="flex gap-1">
          <ThemeToggle />
          <Button
            className="h-8 w-8"
            variant="ghost"
            size="icon"
            onClick={() => setOpenSetting(true)}
          >
            <Settings className="h-5 w-5" />
          </Button>
          {session ? (
            <>
              <Button
                className="h-8 w-8"
                variant="ghost"
                size="icon"
                onClick={() => signOut()}
              >
                <LogOut className="h-5 w-5" />
              </Button>
              <Button
                className="h-8 w-8"
                variant="ghost"
                size="icon"
                asChild
              >
                <Link href="/profile">
                  <User className="h-5 w-5" />
                </Link>
              </Button>
            </>
          ) : (
            <Button
              className="h-8"
              variant="ghost"
              asChild
            >
              <Link href="/login">
                Sign in
              </Link>
            </Button>
          )}
        </div>
      </header>
    </>
  );
}

export default Header;
