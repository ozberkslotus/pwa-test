import { api } from "@/lib/api";
import type { LoginPayload, LoginResponse, User } from "./types";

// Backend hazır olana kadar sahte (mock) yanıt döner.
// .env dosyasına NEXT_PUBLIC_API_URL eklendiğinde gerçek istek atılır.
const USE_MOCK = !process.env.NEXT_PUBLIC_API_URL;

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function login(payload: LoginPayload): Promise<LoginResponse> {
  if (USE_MOCK) {
    await wait(800);
    if (payload.password.length < 6) {
      throw new Error("E-posta veya şifre hatalı.");
    }
    return {
      token: "demo-token",
      user: { id: "1", name: payload.email.split("@")[0], email: payload.email },
    };
  }
  return api<LoginResponse>("/auth/login", { method: "POST", body: payload });
}

export async function getMe(): Promise<User> {
  if (USE_MOCK) {
    await wait(300);
    return { id: "1", name: "Demo Kullanıcı", email: "demo@ornek.com" };
  }
  return api<User>("/auth/me");
}
