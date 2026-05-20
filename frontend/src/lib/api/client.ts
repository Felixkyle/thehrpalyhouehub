import type { ApiErrorBody } from "./types";

export const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:4000";

export class ApiError extends Error {
  status: number;
  code: string;
  fields?: Record<string, string>;

  constructor(status: number, body: ApiErrorBody) {
    super(body.error.message);
    this.status = status;
    this.code = body.error.code;
    this.fields = body.error.fields;
  }
}

let tokenGetter: () => string | null = () => null;
let onUnauthenticated: () => void = () => {};

export function configureClient(opts: { getToken: () => string | null; onUnauthenticated: () => void }) {
  tokenGetter = opts.getToken;
  onUnauthenticated = opts.onUnauthenticated;
}

export async function api<T>(
  path: string,
  opts: { method?: string; body?: unknown; query?: Record<string, string | number | boolean | undefined>; formData?: FormData } = {},
): Promise<T> {
  const url = new URL(`${API_BASE}${path}`);
  if (opts.query) {
    for (const [k, v] of Object.entries(opts.query)) {
      if (v !== undefined && v !== null && v !== "") url.searchParams.set(k, String(v));
    }
  }

  const headers: Record<string, string> = {};
  const token = tokenGetter();
  if (token) headers.Authorization = `Bearer ${token}`;

  let body: BodyInit | undefined;
  if (opts.formData) {
    body = opts.formData;
  } else if (opts.body !== undefined) {
    headers["Content-Type"] = "application/json";
    body = JSON.stringify(opts.body);
  }

  const res = await fetch(url.toString(), { method: opts.method ?? "GET", headers, body });

  if (res.status === 401) onUnauthenticated();

  if (!res.ok) {
    let errBody: ApiErrorBody;
    try {
      errBody = (await res.json()) as ApiErrorBody;
    } catch {
      errBody = { error: { code: "INTERNAL_ERROR", message: res.statusText || "Request failed" } };
    }
    throw new ApiError(res.status, errBody);
  }

  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}
