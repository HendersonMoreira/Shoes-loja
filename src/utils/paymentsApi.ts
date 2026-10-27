export type StorePaymentMethod = 'pix' | 'card' | 'boleto'

export type StoreCheckoutPayload = {
  items: Array<{
    productId: number
    size: number
    quantity: number
  }>
  customer: {
    name: string
    email: string
    phone: string
    postalCode: string
    street: string
    streetNumber: string
    neighborhood: string
    complement: string
    city: string
    state: string
  }
  paymentMethod: StorePaymentMethod
}

export type StorePaymentStatus = {
  paymentId: string
  status: string
}

function getPaymentsApiBaseUrl() {
  const configuredUrl = import.meta.env.VITE_PAYMENTS_API_URL?.trim()
  if (configuredUrl) return configuredUrl.replace(/\/+$/, '')
  if (import.meta.env.DEV) return 'http://localhost:8787'
  throw new Error('URL do servidor de pagamentos não configurada.')
}

async function requestJson<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${getPaymentsApiBaseUrl()}${path}`, init)
  const data = await response.json().catch(() => null) as { success?: boolean; error?: string } | null

  if (!response.ok || data?.success === false) {
    throw new Error(data?.error || 'Não foi possível comunicar com o servidor de pagamentos.')
  }

  if (!data) throw new Error('O servidor de pagamentos retornou uma resposta inválida.')
  return data as T
}

export async function createStoreCheckout(payload: StoreCheckoutPayload) {
  const data = await requestJson<{
    success: true
    paymentUrl: string
    referenceId: string
    checkoutId: string | null
    mode: 'test' | 'live'
  }>('/api/store/checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  return data
}

export type StorePixPayment = {
  paymentId: string
  referenceId: string
  status: string
  pixCode: string
  pixQrCodeBase64: string | null
  amount: number
}

export async function createStorePix(payload: {
  items: StoreCheckoutPayload['items']
  customer: { name: string; email: string; cpf: string }
}) {
  return requestJson<{ success: true } & StorePixPayment>('/api/store/pix', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
}

export async function getStorePaymentStatus(paymentId: string, signal?: AbortSignal) {
  return requestJson<{ success: true } & StorePaymentStatus>(
    `/api/store/payments/${encodeURIComponent(paymentId)}`,
    { signal },
  )
}
