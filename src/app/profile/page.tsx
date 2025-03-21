"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import dynamic from "next/dynamic";

const Header = dynamic(() => import("@/components/Header"));

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-screen-md mx-auto px-4">
      <Header />
      <main>
        <div className="my-8">
          <h2 className="text-xl font-bold mb-6">个人资料</h2>
          <Card>
            <CardHeader>
              <CardTitle>个人信息</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-1">
                <div className="text-sm font-medium text-muted-foreground">用户名</div>
                <div className="text-base">{session?.user?.name || "未设置"}</div>
              </div>
              <div className="grid grid-cols-1 gap-1">
                <div className="text-sm font-medium text-muted-foreground">电子邮箱</div>
                <div className="text-base">{session?.user?.email}</div>
              </div>
              {session?.user?.image && (
                <div className="grid grid-cols-1 gap-1">
                  <div className="text-sm font-medium text-muted-foreground">头像</div>
                  <img
                    src={session.user.image}
                    alt="Profile"
                    className="h-20 w-20 rounded-full"
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
} 