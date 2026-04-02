import { useState, useEffect, useCallback } from 'react'

const API_BASE = '/api'

function getToken() {
  return localStorage.getItem('token')
}

export function useApi<T>(path: string, deps: unknown[] = []) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const token = getToken()
      const res = await fetch(`${API_BASE}${path}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })
      if (res.status === 401) {
        localStorage.removeItem('token')
        window.location.href = '/login'
        return
      }
      if (!res.ok) throw new Error(`${res.status}`)
      const json = await res.json()
      setData(json)
      setError(null)
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path, ...deps])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return { data, loading, error, refetch: fetchData }
}

export async function apiPost(path: string, body: unknown) {
  const token = getToken()
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error((err as { message?: string }).message || `Error ${res.status}`)
  }
  return res.json()
}

export async function apiPatch(path: string, body: unknown) {
  const token = getToken()
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error((err as { message?: string }).message || `Error ${res.status}`)
  }
  return res.json()
}
