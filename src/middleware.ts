import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// 认证相关路由（不需要API密钥）
const authRoutes = ["/api/auth/", "/api/register"];

// 限制中间件只对特定路径生效
export const config = {
  matcher: ["/api/ai/google/:path*"]
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // 检查是否是认证相关路由，直接放行
  for (const authRoute of authRoutes) {
    if (pathname.startsWith(authRoute)) {
      return NextResponse.next();
    }
  }
  
  // 如果是API调用但没有提供API密钥，使用服务器端密钥
  // 这样用户无需登录也能使用研究功能
  if (pathname.startsWith("/api/ai/google/")) {
    // 请求中没有API密钥，我们可以使用环境变量中的密钥
    // 这不会阻止请求，而是确保它能通过
    return NextResponse.next();
  }
  
  return NextResponse.next();
}
