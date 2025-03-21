import { NextResponse, type NextRequest } from "next/server";

export const runtime = "edge";
export const preferredRegion = [
  "cle1",
  "iad1",
  "pdx1",
  "sfo1",
  "sin1",
  "syd1",
  "hnd1",
  "kix1",
];

// 从环境变量中获取Google API密钥
// const GOOGLE_GENERATIVE_AI_API_KEY = process.env.GOOGLE_GENERATIVE_AI_API_KEY as string;
// const API_PROXY_BASE_URL = process.env.API_PROXY_BASE_URL || "https://generativelanguage.googleapis.com";

// 硬编码API密钥和代理URL
const GOOGLE_GENERATIVE_AI_API_KEY = "AIzaSyDmJMjNGz3kLfMQBg0wBHISrdC1leM7j10";
const API_PROXY_BASE_URL = "https://ghl-gemini.deno.dev";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const searchParams = req.nextUrl.searchParams;
  const path = searchParams.getAll("slug");
  searchParams.delete("slug");
  const params = searchParams.toString();

  try {
    let url = `${API_PROXY_BASE_URL}/${path.join("/")}`;
    if (params) url += `?${params}`;
    
    // 使用服务器端密钥，而不关心客户端是否提供了密钥
    // 这样即使用户未登录，也能使用研究功能
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": req.headers.get("Content-Type") || "application/json",
        "x-goog-api-client":
          req.headers.get("x-goog-api-client") || "genai-js/0.24.0",
        // 始终使用硬编码的API密钥
        "x-goog-api-key": GOOGLE_GENERATIVE_AI_API_KEY,
      },
      body: JSON.stringify(body),
    });
    
    return new NextResponse(response.body, {
      status: response.status,
      headers: {
        'Content-Type': response.headers.get("Content-Type") || "application/json",
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, x-goog-api-client, x-goog-api-key',
      }
    });
  } catch (error) {
    if (error instanceof Error) {
      console.error(error);
      return NextResponse.json(
        { code: 500, message: error.message },
        { status: 500 }
      );
    }
  }
}
