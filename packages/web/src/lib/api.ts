const API_BASE = '/api'

function getToken(): string | null {
  return localStorage.getItem('token')
}

async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken()
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  })

  if (response.status === 401) {
    localStorage.removeItem('token')
    window.location.href = '/login'
    throw new Error('Unauthorized')
  }

  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`)
  }

  return response.json() as Promise<T>
}

// Auth
export async function login(username: string, password: string) {
  const data = await apiFetch<{ token: string; user: { id: number; username: string; role: string } }>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  })
  localStorage.setItem('token', data.token)
  return data
}

export function logout() {
  localStorage.removeItem('token')
  window.location.href = '/login'
}

// Vehicles
export function getVehicles(params?: Record<string, string>) {
  const qs = params ? '?' + new URLSearchParams(params).toString() : ''
  return apiFetch<{ data: unknown[]; total: number }>(`/vehicles${qs}`)
}

export function getVehicle(id: number) {
  return apiFetch<unknown>(`/vehicles/${id}`)
}

export function createVehicle(data: unknown) {
  return apiFetch<unknown>('/vehicles', { method: 'POST', body: JSON.stringify(data) })
}

export function updateVehicle(id: number, data: unknown) {
  return apiFetch<unknown>(`/vehicles/${id}`, { method: 'PUT', body: JSON.stringify(data) })
}

// Handovers
export function getHandovers(params?: Record<string, string>) {
  const qs = params ? '?' + new URLSearchParams(params).toString() : ''
  return apiFetch<{ data: unknown[]; total: number }>(`/handovers${qs}`)
}

export function createHandover(data: unknown) {
  return apiFetch<unknown>('/handovers', { method: 'POST', body: JSON.stringify(data) })
}

// Workshop
export function getWorkshopOrders(params?: Record<string, string>) {
  const qs = params ? '?' + new URLSearchParams(params).toString() : ''
  return apiFetch<{ data: unknown[]; total: number }>(`/workshop${qs}`)
}

export function createWorkshopOrder(data: unknown) {
  return apiFetch<unknown>('/workshop', { method: 'POST', body: JSON.stringify(data) })
}

// Accidents
export function getAccidents(params?: Record<string, string>) {
  const qs = params ? '?' + new URLSearchParams(params).toString() : ''
  return apiFetch<{ data: unknown[]; total: number }>(`/accidents${qs}`)
}

export function createAccident(data: unknown) {
  return apiFetch<unknown>('/accidents', { method: 'POST', body: JSON.stringify(data) })
}

// Offenses
export function getOffenses(params?: Record<string, string>) {
  const qs = params ? '?' + new URLSearchParams(params).toString() : ''
  return apiFetch<{ data: unknown[]; total: number }>(`/offenses${qs}`)
}

export function createOffense(data: unknown) {
  return apiFetch<unknown>('/offenses', { method: 'POST', body: JSON.stringify(data) })
}

// Tours (MilkyWay)
export function getTours(params?: Record<string, string>) {
  const qs = params ? '?' + new URLSearchParams(params).toString() : ''
  return apiFetch<{ data: unknown[]; total: number }>(`/tours${qs}`)
}

export function createTour(data: unknown) {
  return apiFetch<unknown>('/tours', { method: 'POST', body: JSON.stringify(data) })
}

// Inventory
export function getInventory(params?: Record<string, string>) {
  const qs = params ? '?' + new URLSearchParams(params).toString() : ''
  return apiFetch<{ data: unknown[]; total: number }>(`/inventory${qs}`)
}

// Admin
export function getSettings() {
  return apiFetch<unknown>('/admin/settings')
}

export function getLogs(params?: Record<string, string>) {
  const qs = params ? '?' + new URLSearchParams(params).toString() : ''
  return apiFetch<{ data: unknown[]; total: number }>(`/admin/logs${qs}`)
}

export function getDashboard() {
  return apiFetch<unknown>('/dashboard')
}
