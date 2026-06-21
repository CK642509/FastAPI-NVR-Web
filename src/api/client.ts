// API 基底路徑：開發期由 Vite proxy 轉到後端，正式環境走 Caddy 同源。
// 可用 VITE_API_BASE 覆寫。
const API_BASE = import.meta.env.VITE_API_BASE ?? '/api'

/** 發出 JSON 請求；非 2xx 會 throw 含後端 detail 的錯誤。 */
export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, init)
  if (!res.ok) {
    let detail = ''
    try {
      const body = await res.json()
      detail = (body as { detail?: string }).detail ?? JSON.stringify(body)
    } catch {
      detail = res.statusText
    }
    throw new Error(`HTTP ${res.status}: ${detail}`)
  }
  return (await res.json()) as T
}

/** 取得可直接放進 <img>/<a> 的完整資源 URL（串流、快照）。 */
export function apiUrl(path: string): string {
  return `${API_BASE}${path}`
}
