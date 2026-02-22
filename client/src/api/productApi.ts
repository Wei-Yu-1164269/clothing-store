import type { Product } from "../types/product";

// const BASE_URL = 'http://127.0.0.1:5000'

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

async function requestJSON<T>(url: string): Promise<T> {
  const res = await fetch(url, { method: "GET" });

  if (!res.ok) {
    // 尽量把服务端错误信息带出来
    const text = await res.text().catch(() => "");
    throw new Error(
      `HTTP ${res.status} ${res.statusText}${text ? ` - ${text}` : ""}`,
    );
  }

  return (await res.json()) as T;
}

export async function fetchProduct(productId: number): Promise<Product> {
  return requestJSON<Product>(`${BASE_URL}/product/${productId}`);
}
