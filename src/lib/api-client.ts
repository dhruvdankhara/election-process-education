import { ApiError } from "@/core/utils/api-response";

async function request<T>(url: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  const payload = await response.json();

  if (!response.ok) {
    throw new ApiError(
      payload.error?.code || "FETCH_ERROR",
      payload.error?.message || response.statusText,
      response.status
    );
  }

  return payload.data;
}

export const apiClient = {
  get: <T>(url: string, options?: RequestInit) => request<T>(url, { ...options, method: "GET" }),
  post: <T>(url: string, body?: unknown, options?: RequestInit) =>
    request<T>(url, { ...options, method: "POST", body: JSON.stringify(body) }),
  put: <T>(url: string, body?: unknown, options?: RequestInit) =>
    request<T>(url, { ...options, method: "PUT", body: JSON.stringify(body) }),
  patch: <T>(url: string, body?: unknown, options?: RequestInit) =>
    request<T>(url, { ...options, method: "PATCH", body: JSON.stringify(body) }),
  delete: <T>(url: string, options?: RequestInit) =>
    request<T>(url, { ...options, method: "DELETE" }),
};
