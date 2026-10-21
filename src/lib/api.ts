import { tokenStorage } from "./token-storage";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

type RequestOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
};

// Tüm istekler buradan geçer: token ekleme, JSON çevirme ve hata yönetimi tek yerde.
export async function api<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const token = tokenStorage.get();
  const headers = new Headers(options.headers);
  headers.set("Accept", "application/json");
  if (options.body !== undefined) headers.set("Content-Type", "application/json");
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
  });

  const data = res.status === 204 ? null : await res.json().catch(() => null);

  if (!res.ok) {
    if (res.status === 401) tokenStorage.clear();
    const message =
      (data as { message?: string } | null)?.message ?? "Bir sorun oluştu. Tekrar deneyin.";
    throw new ApiError(message, res.status, data);
  }

  return data as T;
}
